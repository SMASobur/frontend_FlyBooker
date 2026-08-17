import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/flightApi';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { LogIn, UserPlus, Loader2, AlertCircle } from 'lucide-react';

const AuthView = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('USER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [adminCode, setAdminCode] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = isLogin
                ? await authApi.login({ username, password })
                : await authApi.register({ username, email, password, role, adminCode });

            login(response);
            navigate('/'); // Redirect to home after login
        } catch (err: any) {
            // Try to parse backend error message
            try {
                const errData = JSON.parse(err.message);
                setError(errData.message || 'Authentication failed');
            } catch {
                setError(err.message || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            {/* Tabs */}
            <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
                <button
                    onClick={() => { setIsLogin(true); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors font-medium ${
                        isLogin ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500'
                    }`}
                >
                    <LogIn size={18} /> Login
                </button>
                <button
                    onClick={() => { setIsLogin(false); setError(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors font-medium ${
                        !isLogin ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500'
                    }`}
                >
                    <UserPlus size={18} /> Register
                </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                {isLogin ? 'Welcome Back!' : 'Create an Account'}
            </h2>

            {error && (
                <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                        placeholder="Enter username"
                    />
                </div>
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            placeholder="Enter email"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                        placeholder="Enter password"
                    />
                </div>

                {/* Role Selector (Only for Registration) */}
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Register as</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="USER">Regular User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                )}

                {/* Admin Code Input (Only if registering as Admin) */}
                {!isLogin && role === 'ADMIN' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Admin Secret Code</label>
                        <input
                            type="password"
                            required
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            placeholder="Enter admin code"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-500    hover: bg-cyan-700 text-white py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? <LogIn size={18} /> : <UserPlus size={18} />)}
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default AuthView;