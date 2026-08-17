import { useEffect, useState, useMemo } from 'react';
import { flightApi } from '../api/flightApi';
import type { Flight } from '../types';
import FlightCard from '../components/FlightCard';
import FlightDetailsModal from '../components/FlightDetailsModal';
import { XCircle, Search, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const BookedFlightsView = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null); // State for modal
    const [searchQuery, setSearchQuery] = useState(''); // New state for search
    const { role } = useAuth();
    const isAdmin = role === 'ADMIN';

    useEffect(() => {
        const fetchBookedFlights = async () => {
            try {
                setLoading(true);
                const allFlights = await flightApi.getAllFlights();
                const bookedOnly = allFlights.filter(flight => flight.status?.toUpperCase() === 'BOOKED');
                setFlights(bookedOnly);
            } catch (err) {
                setError('Failed to fetch booked flights.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookedFlights();
    }, []);

    const filteredFlights = useMemo(() => {
        if (searchQuery.trim() === '') return flights;
        return flights.filter(flight =>
            flight.destination.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [flights, searchQuery]);

    if (loading) return <div className="text-center text-gray-500 mt-10">Loading booked flights...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <XCircle size={24} className="text-red-500" />
                All Booked Flights
            </h2>

            {/* Admin Warning Banner for Regular Users */}
            {!isAdmin && (
                <div className="mb-6 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-lg text-sm">
                    <Lock size={16} />
                    To see Passenger details you need to login as Admin.
                </div>
            )}

            {/* Search Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="relative flex-grow">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by destination city..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {filteredFlights.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <p>{searchQuery ? `No booked flights found matching "${searchQuery}".` : "No flights have been booked yet."}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFlights.map((flight) => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            // ONLY pass onViewDetails if user is admin! Otherwise, it gets undefined.
                            onViewDetails={isAdmin ? (f) => setSelectedFlight(f) : undefined}
                        />
                    ))}
                </div>
            )}

            {/* Render Details Modal */}
            {selectedFlight && (
                <FlightDetailsModal
                    flight={selectedFlight}
                    onClose={() => setSelectedFlight(null)}
                />
            )}
        </div>
    );
};

export default BookedFlightsView;