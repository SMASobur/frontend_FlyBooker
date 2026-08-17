import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthResponse, Role } from '../types';

interface AuthContextType {
    token: string | null;
    role: Role | null;
    username: string | null;
    email: string | null;
    isAuthenticated: boolean;
    login: (data: AuthResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
    const [role, setRole] = useState<Role | null>(localStorage.getItem('user_role') as Role | null);
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [email, setEmail] = useState<string | null>(localStorage.getItem('user_email'));


    const login = (data: AuthResponse) => {
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('username', data.username);
        localStorage.setItem('user_email', data.email);
        setToken(data.token);
        setRole(data.role);
        setUsername(data.username);
        setEmail(data.email);
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        localStorage.removeItem('user_email');
        setToken(null);
        setRole(null);
        setUsername(null);
        setEmail(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, username, email, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};