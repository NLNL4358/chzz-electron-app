import React from 'react';
import { useAuth } from '../providers/AuthProvider';

function NaverLogout() {
    const { naverLogout } = useAuth();
    return (
        <div className="logoutWrap">
            <button
                className="loginButton"
                onClick={() => {
                    naverLogout();
                }}
            >
                로그아웃
            </button>
        </div>
    );
}

export default NaverLogout;
