import React from 'react';
import { useAuth } from '../providers/AuthProvider';

function NaverLogin() {
    const { naverLogin } = useAuth();

    return (
        <div>
            <button
                onClick={() => {
                    naverLogin();
                }}
            >
                login
            </button>
        </div>
    );
}

export default NaverLogin;
