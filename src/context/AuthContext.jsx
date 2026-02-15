import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (email, password, role = 'Admin') => {
        // Mock login - accept any valid-looking input for demo
        if (email && password) {
            const newUser = {
                email,
                name: email.split('@')[0] || 'User',
                role: role
            };
            setUser(newUser);
            return true;
        }
        return false;
    };

    const loginWithGoogle = (email) => {
        if (email) {
            const newUser = {
                email,
                name: email.split('@')[0] || 'User',
                role: 'Admin' // Default for demo
            };
            setUser(newUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isAuthenticated: !!user, isAdmin: user?.role === 'Admin' }}>
            {children}
        </AuthContext.Provider>
    );
};
