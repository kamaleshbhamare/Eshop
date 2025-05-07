import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // On app load: restore from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, [token]);

    const login = ({ userData, token }) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(userData));
        // localStorage.setItem("token", token);
        // Setting token manually. This is the work around as per the set up document.
        localStorage.setItem('token', "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGRlbW8uY29tIiwiaWF0IjoxNzQ2NjA0MDk1LCJleHAiOjE3NDY2MTI0OTV9.BzMbNjUqcTGus6cDg8z9HgJg649BieRx-ilfqcBhVpnfvNr3rD5F0gELApguieoapU_J1RNCOLwqcDTaKbeIPw");
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};