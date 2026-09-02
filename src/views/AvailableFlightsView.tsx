import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { flightApi } from '../api/flightApi';
import type { Flight } from '../types';
import FlightCard from '../components/FlightCard';
import BookingModal from '../components/BookingModal';
import { CheckCircle, Search, Loader2 } from 'lucide-react';

const AvailableFlightsView = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    // Pagination States
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchFlights = useCallback(async (pageNum: number) => {
        try {
            if (pageNum === 0) setLoading(true);
            else setLoadingMore(true);

            const data = await flightApi.getAvailableFlights(pageNum, 50);
            setFlights(prev => pageNum === 0 ? data.content : [...prev, ...data.content]);
            setHasMore(!data.last);
        } catch (err) {
            setError('Failed to fetch available flights.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchFlights(0);
    }, [fetchFlights]);

    useEffect(() => {
        if (page > 0) {
            fetchFlights(page);
        }
    }, [page, fetchFlights]);

    const handleNotify = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredFlights = useMemo(() => {
        if (searchQuery.trim() === '') return flights;
        return flights.filter(flight =>
            flight.destination.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [flights, searchQuery]);

    // Intersection Observer Logic
    const observer = useRef<IntersectionObserver | null>(null);

    const lastFlightRef = useCallback((node: HTMLDivElement) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    if (loading) return <div className="text-center text-gray-500 mt-10">Loading available flights...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Flights</h2>

            {notification && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
                    <CheckCircle size={18} /> {notification}
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
                    <p>{searchQuery ? `No available flights found matching "${searchQuery}".` : "No available flights found."}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFlights.map((flight, index) => {
                        if (index === filteredFlights.length - 1) {
                            return (
                                <div key={flight.id} ref={lastFlightRef}>
                                    <FlightCard flight={flight} onBook={(f) => setSelectedFlight(f)} />
                                </div>
                            );
                        } else {
                            return (
                                <FlightCard key={flight.id} flight={flight} onBook={(f) => setSelectedFlight(f)} />
                            );
                        }
                    })}
                </div>
            )}

            {loadingMore && (
                <div className="text-center text-gray-400 mt-8 flex items-center justify-center gap-2 text-sm">
                    <Loader2 size={16} className="animate-spin" /> Loading more flights...
                </div>
            )}

            {selectedFlight && (
                <BookingModal
                    flight={selectedFlight}
                    onClose={() => setSelectedFlight(null)}
                    onSuccess={() => fetchFlights(0)}
                    onNotify={handleNotify}
                />
            )}
        </div>
    );
};

export default AvailableFlightsView;