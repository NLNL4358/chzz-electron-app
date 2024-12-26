import React, { useState, useContext, useEffect } from 'react';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    /*** 상수 */
    const supabaseUserInfoURL =
        'https://ykorbmtrpjhatgnhbjbp.supabase.co/functions/v1/get-user-info'; // 유저정보 가저오는 supabase Function 요청 URL

    /*** Variable */
    const userInfoObject = {
        userId: '',
        userName: '',
    };

    /*** useState */
    const [loginStatus, setLoginStatus] = useState(userInfoObject);

    /*** Function */
    const naverLogin = () => {
        if (window.electronAPI) {
            window.electronAPI.openNaverLoginWindow();
        } else {
            alert('electron 오류');
        }
    };

    const getUserInfo = async (accessToken) => {
        fetch(`${supabaseUserInfoURL}?accessToken=${accessToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb3JibXRycGpoYXRnbmhiamJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NDg1NTMsImV4cCI6MjA0MTQyNDU1M30.BMF7MCmJIcjHmv1OTpbwSyLd23iz4FrMa1cDtQxa5dc',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
    };

    /*** returnValue */
    const value = {
        loginStatus,
        setLoginStatus,
        naverLogin,
    };

    /*** UseEffect */
    useEffect(() => {
        // Electron main에서 인증 성공 시 accessToken 를 돌려받음
        window.electronAPI.onAuthSuccess((response) => {
            // setLoginStatus({
            //     userId: userInfo.userId,
            //     userName: userInfo.userName,
            // });
            console.log('Received Response', response);
            if (response?.accessToken) {
                getUserInfo(response.accessToken);
            } else {
                alert('Get User Access Token Error');
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
