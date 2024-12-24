import React from 'react';

const publicUrl = process.env.PUBLIC_URL;

function Header() {
    return (
        <div className="header">
            <img src={`${publicUrl}/img/chzzIcon.png`} alt="" />
        </div>
    );
}

export default Header;
