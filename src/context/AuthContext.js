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
        localStorage.setItem('token', "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc0NDgwMTE3MSwiZXhwIjoxNzQ0ODA5NTcxfQ.x2qwnCYlRPFGaNQftM3yFG1bQf2kGCoBIhWt_gJYBGJZbwCv1rlWMJpbzv0wEQXsSQSJLrH1ugqUvdEe3vo8iA");
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