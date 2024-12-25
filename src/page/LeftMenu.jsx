import React from 'react';

import NaverLogin from '../component/NaverLogin';

const publicUrl = process.env.PUBLIC_URL;

function LeftMenu() {
    return (
        <div className="leftMenu">
            <div className="profileWrap">
                <img
                    className="userProfile"
                    src={`${publicUrl}/img/defaultUserImg.png`}
                    alt=""
                />
            </div>
            <NaverLogin />
        </div>
    );
}

export default LeftMenu;
