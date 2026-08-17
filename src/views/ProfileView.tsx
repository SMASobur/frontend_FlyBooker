import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, ShieldCheck, BadgeCheck, LogIn, PlaneTakeoff } from 'lucide-react';

const ProfileView = () => {
    const { isAuthenticated, username, email, role } = useAuth();

    // If user is not logged in
    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
                <LogIn size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Restricted</h2>
                <p className="text-slate-500 mb-6">Please log in to view your profile and manage your account.</p>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-cyan-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
                >
                    <LogIn size={18} /> Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User size={24} className="text-cyan-500" />
                My Profile
            </h2>

            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl shadow-xl p-8 text-white mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar Circle */}
                    <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center text-4xl font-bold text-slate-900 shadow-lg">
                        {username?.charAt(0).toUpperCase()}
                    </div>

                    <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-bold">{username}</h3>
                        <p className="text-slate-300 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1">
                            <Mail size={14} /> {email}
                        </p>
                        <div className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                            role === 'ADMIN' ? 'bg-indigo-500 text-white' : 'bg-cyan-100 text-cyan-800'
                        }`}>
                            {role === 'ADMIN' ? <ShieldCheck size={12} /> : <BadgeCheck size={12} />}
                            {role} ACCOUNT
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Details List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                <h4 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-2">Account Details</h4>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-500 text-sm flex items-center gap-2">
            <User size={16} /> Username
          </span>
                    <span className="font-semibold text-slate-800">{username}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-500 text-sm flex items-center gap-2">
            <Mail size={16} /> Email Address
          </span>
                    <span className="font-semibold text-slate-800">{email}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-500 text-sm flex items-center gap-2">
            <ShieldCheck size={16} /> Role
          </span>
                    <span className="font-semibold text-slate-800">{role}</span>
                </div>
            </div>

            {/* Quick Action */}
            <div className="mt-6 text-center">
                <Link
                    to="/bookings"
                    className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-500 font-medium transition-colors"
                >
                    <PlaneTakeoff size={18} /> View My Bookings
                </Link>
            </div>
        </div>
    );
};

export default ProfileView;