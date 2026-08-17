import { NavLink, useNavigate } from 'react-router-dom';
import { Plane, LayoutGrid, CheckCircle, BookUser, XCircle, LogIn, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, role, username, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Go home after logout
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isActive ? 'bg-cyan-500 text-slate-900 font-semibold' : 'text-slate-300 hover:bg-slate-600'
        }`;

    return (
        <nav className="bg-slate-900 shadow-md p-4 mb-6 sticky top-0 z-50 border-b border-slate-800">
            <div className="container mx-auto flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2 text-cyan-400 font-bold text-xl">
                    <Plane size={24} />
                    <span>FlyBooker</span>
                </NavLink>

                <div className="flex items-center space-x-2">
                    <NavLink to="/" className={linkClass} end>
                        <LayoutGrid size={18} /> All Flights
                    </NavLink>
                    <NavLink to="/available" className={linkClass}>
                        <CheckCircle size={18} /> Available
                    </NavLink>
                    <NavLink to="/booked" className={linkClass}>
                        <XCircle size={18} /> Booked
                    </NavLink>
                    <NavLink to="/bookings" className={linkClass}>
                        <BookUser size={18} /> Manage Bookings
                    </NavLink>

                    {/* Auth Section */}
                    <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-slate-700">
                        {isAuthenticated ? (
                            <>
                                {/* User Info Badge acts as Profile Link */}
                                <NavLink to="/profile" title="View Profile">
                                    {({ isActive }) => (
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                                            isActive
                                                ? 'bg-cyan-500 text-slate-900 font-semibold'
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-600'
                                        }`}>
                                            {role === 'ADMIN' ? <ShieldCheck size={16} /> : <User size={16} />}
                                            <span className="font-medium">{username}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                isActive
                                                    ? 'bg-slate-900/20 text-slate-900'
                                                    : role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-400'
                                            }`}>
                        {role}
                      </span>
                                        </div>
                                    )}
                                </NavLink>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" className="flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-500 text-slate-900 hover:bg-cyan-400 transition-colors text-sm font-bold">
                                <LogIn size={18} /> Login
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;