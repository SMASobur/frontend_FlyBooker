import { Link } from 'react-router-dom';
import { Plane, Heart, Code } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
            <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Left side: Logo & Copyright */}
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Plane size={18} className="rotate-90 text-cyan-400" />
                    <span className="font-semibold text-white">FlyBooker</span>
                    <span className="hidden sm:inline">|</span>
                    <span>© {currentYear} All rights reserved.</span>
                </div>

                {/* Middle: Quick Links */}
                <div className="flex items-center gap-4 text-sm text-slate-400">
                    <Link to="/" className="hover:text-cyan-400 transition-colors">All Flights</Link>
                    <Link to="/available" className="hover:text-cyan-400 transition-colors">Available</Link>
                    <Link to="/booked" className="hover:text-cyan-400 transition-colors">Booked</Link>
                    <Link to="/bookings" className="hover:text-cyan-400 transition-colors">Manage Bookings</Link>
                </div>

                {/* Right side: Tech Stack / Source Code */}
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <span>Built with</span>
                    <Heart size={14} className="text-red-500 fill-red-500" />
                    <span>using React & Spring Boot</span>
                    <a
                        href="https://github.com/SMASobur/FlightProjectWorkspace"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Code size={16} /> Source
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
