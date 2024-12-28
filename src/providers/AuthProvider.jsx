import React, { useState, useContext, useEffect } from 'react';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    /*** 상수 */
    const supabaseGetTokenURL =
        'https://ykorbmtrpjhatgnhbjbp.supabase.co/functions/v1/get-naver-token'; // code를 이용해서 Token 요청 코드 supabase Function 요청 URL
    const supabaseUserInfoURL =
        'https://ykorbmtrpjhatgnhbjbp.supabase.co/functions/v1/get-user-info'; // 유저정보 가저오는 supabase Function 요청 URL

    /*** useState */
    const [loginStatus, setLoginStatus] = useState(null);
    const [naverAccessToken, setNaverAccessToken] = useState(null);

    /*** Function */
    const naverLogin = () => {
        if (window.electronAPI) {
            window.electronAPI.openNaverLoginWindow();
        } else {
            alert('electron 오류');
        }
    };

    /**
     * 로그인 개발자 API에서 받은 code를
     * code -> AccessToken -> 로그인 정보로 바꿔가는 과정을 수행하는 함수
     * @param {} code
     */
    const getUserInfo = async (code) => {
        const token = await getAccessToken(code);
        setNaverAccessToken(token);

        const response = await fetch(
            `${supabaseUserInfoURL}?accessToken=${token}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb3JibXRycGpoYXRnbmhiamJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NDg1NTMsImV4cCI6MjA0MTQyNDU1M30.BMF7MCmJIcjHmv1OTpbwSyLd23iz4FrMa1cDtQxa5dc',
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // JSON 데이터를 읽어서 확인
        const data = await response.json();
        console.log('Response Data:', data);

        // 상태 업데이트
        setLoginStatus(data);
    };

    /**
     * 받은 code를 이용해 AccessToken을 supabase FUnction 을 이용해서 받아옴
     * @param {*} code
     * @returns accessToken 리턴
     */
    const getAccessToken = async (code) => {
        const response = await fetch(`${supabaseGetTokenURL}?code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb3JibXRycGpoYXRnbmhiamJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NDg1NTMsImV4cCI6MjA0MTQyNDU1M30.BMF7MCmJIcjHmv1OTpbwSyLd23iz4FrMa1cDtQxa5dc',
            },
        });

        const data = await response.json();
        if (data.accessToken) {
            return data.accessToken;
        } else {
            throw new Error('Failed to get access token from Supabase');
        }
    };

    const naverLogout = async () => {
        if (naverAccessToken === null) {
            alert('엑세스 토큰이 없습니다.');
            return;
        }

        try {
            const response = await fetch(
                'https://ykorbmtrpjhatgnhbjbp.supabase.co/functions/v1/logout-naver-token', // Supabase logout URL
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb3JibXRycGpoYXRnbmhiamJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NDg1NTMsImV4cCI6MjA0MTQyNDU1M30.BMF7MCmJIcjHmv1OTpbwSyLd23iz4FrMa1cDtQxa5dc', // JWT 토큰
                    },
                    body: JSON.stringify({ accessToken: naverAccessToken }), // access_token 전달
                },
            );

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // 로그아웃 성공 메시지 출력
                setLoginStatus(null);
                setNaverAccessToken(null);
            } else {
                const error = await response.json();
                console.error('Logout failed:', error.error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    /*** returnValue */
    const value = {
        loginStatus,
        setLoginStatus,
        naverLogin,
        naverLogout,
    };

    /*** UseEffect */
    useEffect(() => {
        // Electron main에서 인증 성공 시 로그인 code 를 돌려받음
        window.electronAPI.onAuthSuccess((response) => {
            console.log('Received Response', response);
            if (response?.code) {
                getUserInfo(response.code);
            } else {
                alert('Get User Access Token Error');
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
