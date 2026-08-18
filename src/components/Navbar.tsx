import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plane, LayoutGrid, CheckCircle, BookUser, XCircle, LogIn, LogOut, ShieldCheck, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, role, username, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false); // Close menu on logout
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isActive ? 'bg-cyan-500 text-slate-900 font-semibold' : 'text-slate-300 hover:bg-slate-600'
        }`;

    return (
        <nav className="bg-slate-900 shadow-md p-4 mb-6 sticky top-0 z-50 border-b border-slate-800">
            <div className="container mx-auto flex items-center justify-between">

                {/* Left side: Logo */}
                <NavLink to="/" className="flex items-center gap-2 text-cyan-400 font-bold text-xl" onClick={() => setIsMenuOpen(false)}>
                    <Plane size={24} />
                    <span>FlyBooker</span>
                </NavLink>

                {/* Burger Menu Button (Visible only on mobile/tablet) */}
                <button
                    className="lg:hidden text-slate-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Menu (Hidden on mobile/tablet) */}
                <div className="hidden lg:flex items-center space-x-2">
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

                    {/* Auth Section (Desktop) */}
                    <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-slate-700">
                        {isAuthenticated ? (
                            <>
                                <NavLink to="/profile" title="View Profile">
                                    {({ isActive }) => (
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
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

            {/* Mobile Menu (Conditional) */}
            {isMenuOpen && (
                <div className="lg:hidden flex flex-col space-y-2 mt-4 pt-4 border-t border-slate-800">
                    <NavLink to="/" className={linkClass} end onClick={() => setIsMenuOpen(false)}>
                        <LayoutGrid size={18} /> All Flights
                    </NavLink>
                    <NavLink to="/available" className={linkClass} onClick={() => setIsMenuOpen(false)}>
                        <CheckCircle size={18} /> Available
                    </NavLink>
                    <NavLink to="/booked" className={linkClass} onClick={() => setIsMenuOpen(false)}>
                        <XCircle size={18} /> Booked
                    </NavLink>
                    <NavLink to="/bookings" className={linkClass} onClick={() => setIsMenuOpen(false)}>
                        <BookUser size={18} /> Manage Bookings
                    </NavLink>

                    {/* Auth Section (Mobile) */}
                    <div className="flex flex-col space-y-3 pt-4 mt-2 border-t border-slate-800">
                        {isAuthenticated ? (
                            <>
                                <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
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
                                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium w-full justify-center"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </>
                        ) : (
                            <NavLink
                                to="/login"
                                className="flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-500 text-slate-900 hover:bg-cyan-400 transition-colors text-sm font-bold justify-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <LogIn size={18} /> Login
                            </NavLink>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;