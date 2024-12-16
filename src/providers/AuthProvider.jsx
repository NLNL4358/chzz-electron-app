import React, { useState, useContext } from "react";

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext)
}

const userInfoObject = {
    "userId": "",
    "userName": "",
}

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(userInfoObject)

    const value = {
        userInfo,
        setUserInfo,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}