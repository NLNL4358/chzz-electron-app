import React from 'react';
import { useAuth } from '../providers/AuthProvider';

import NaverLogin from '../component/NaverLogin';
import NaverLogout from '../component/NaverLogout';

const publicUrl = process.env.PUBLIC_URL;

function LeftMenu() {
    const { loginStatus } = useAuth();
    return (
        <div className="leftMenu">
            <div className={`profileWrap ${loginStatus ? 'login' : 'logout'}`}>
                <img
                    className="userProfile"
                    src={
                        loginStatus?.profile_image
                            ? loginStatus?.profile_image
                            : `${publicUrl}/img/defaultUserImg.png`
                    }
                    alt=""
                />
            </div>
            {loginStatus === null ? (
                <NaverLogin />
            ) : (
                <h4 className="nickName">
                    {loginStatus?.nickname
                        ? loginStatus?.nickname
                        : '닉네임 오류'}
                </h4>
            )}

            {loginStatus === null ? null : <NaverLogout />}
        </div>
    );
}

export default LeftMenu;
