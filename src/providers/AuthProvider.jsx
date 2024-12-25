import React, { useState, useContext, useEffect } from 'react';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
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
        if (accessToken === undefined || accessToken === null) {
            alert('로그인 Token 오류');
            return;
        }
        try {
            const profileURL = 'https://openapi.naver.com/v1/nid/me';
            const profileResponse = await fetch(profileURL, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const profileData = await profileResponse.json();
            console.log(profileData);
        } catch (error) {
            return new Response('Internal Server Error', { status: 500 });
        }
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
        window.electronAPI.onAuthSuccess((accessToken) => {
            // setLoginStatus({
            //     userId: userInfo.userId,
            //     userName: userInfo.userName,
            // });
            console.log('Received User accessToken:', accessToken);
            getUserInfo(accessToken);
        });
    }, []);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
