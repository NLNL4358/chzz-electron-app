import React from 'react';

const publicUrl = process.env.PUBLIC_URL;

function Header() {
    return (
        <div className="header">
            <div className="headerL">
                <img
                    className="headerLogo"
                    src={`${publicUrl}/img/chzzIcon.png`}
                    alt=""
                />
                <span>치지직 플레이어</span>
            </div>
            <div className="headerR">
                <button className="programCloseButton">
                    <img src={`${publicUrl}/icon/turnOffIcon.png`} alt="" />
                </button>
            </div>
        </div>
    );
}

export default Header;
