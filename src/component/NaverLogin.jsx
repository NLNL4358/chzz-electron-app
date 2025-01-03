import React from 'react';
import { useAuth } from '../providers/AuthProvider';

function NaverLogin() {
    const { naverLogin } = useAuth();

    return (
        <div>
            <button
                className="loginButton"
                onClick={() => {
                    naverLogin();
                }}
            >
                로그인
            </button>
        </div>
    );
}

export default NaverLogin;
