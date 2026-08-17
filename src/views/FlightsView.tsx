import { useEffect, useState, useMemo } from 'react';
import { flightApi } from '../api/flightApi';
import type { Flight } from '../types';
import FlightCard from '../components/FlightCard';
import BookingModal from '../components/BookingModal';
import { CheckCircle, Search, ArrowUpDown } from 'lucide-react';

const FlightsView = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

    const fetchFlights = async () => {
        try {
            setLoading(true);
            const data = await flightApi.getAllFlights();
            setFlights(data);
        } catch (err) {
            setError('Failed to fetch flights. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    // function to show notification for 3 seconds
    const handleNotify = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // useMemo calculates the filtered list automatically whenever flights or searchQuery changes
    const filteredFlights = useMemo(() => {
        let result = [...flights];

        // Filter by city name
        if (searchQuery.trim() !== '') {
            result = result.filter(flight =>
                flight.destination.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // sort by price
        if (sortOrder === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [flights, searchQuery, sortOrder]);

    if (loading) return <div className="text-center text-gray-500 mt-10">Loading flights...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Scheduled Flights</h2>

            {/* Notification Banner */}
            {notification && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
                    <CheckCircle size={18} />
                    {notification}
                </div>
            )}

            {/* Search & Sort Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="relative flex-grow">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by destination city..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>

                <div className="relative">
                    <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'default' | 'asc' | 'desc')}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                        <option value="default">Sort by Price</option>
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {filteredFlights.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <p>No flights found matching "{searchQuery}".</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFlights.map((flight) => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            onBook={(f) => setSelectedFlight(f)}
                        />
                    ))}
                </div>
            )}

            {selectedFlight && (
                <BookingModal
                    flight={selectedFlight}
                    onClose={() => setSelectedFlight(null)}
                    onSuccess={fetchFlights}
                    onNotify={handleNotify}
                />
            )}
        </div>
    );

};

export default FlightsView;