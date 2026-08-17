import { Link } from 'react-router-dom';
import { PlaneTakeoff, BookUser } from 'lucide-react';
import FlightsView from './FlightsView';

const HomeView = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white rounded-2xl shadow-xl p-8 md:p-16 mb-10 overflow-hidden">
                {/* Decorative blurred circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                        Explore the World with <span className="text-cyan-400">FlyBooker</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-8">
                        Find and book the best flights available. Seamless booking, easy management, and instant confirmations.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/available"
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/30"
                        >
                            <PlaneTakeoff size={20} /> Book a Flight
                        </Link>
                        <Link
                            to="/bookings"
                            className="bg-transparent border-2 border-slate-400 hover:border-white text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <BookUser size={20} /> My Bookings
                        </Link>
                    </div>
                </div>
            </div>

            {/* Render the flight list below  */}
            <FlightsView />
        </div>
    );
};

export default HomeView;