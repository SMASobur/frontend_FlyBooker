import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { flightApi } from '../api/flightApi';
import type { Flight } from '../types';
import FlightCard from '../components/FlightCard';
import BookingModal from '../components/BookingModal';
import { CheckCircle, Search, ArrowUpDown, Loader2 } from 'lucide-react';

const FlightsView = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

    // Pagination States
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // 1. Wrap fetchFlights in useCallback to satisfy React dependency rules
    const fetchFlights = useCallback(async (pageNum: number) => {
        try {
            if (pageNum === 0) setLoading(true);
            else setLoadingMore(true);

            const data = await flightApi.getAllFlights(pageNum, 50);

            setFlights(prev => pageNum === 0 ? data.content : [...prev, ...data.content]);
            setHasMore(!data.last);
        } catch (err) {
            setError('Failed to fetch flights. Is the backend running?');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // 2. Initial load only
    useEffect(() => {
        fetchFlights(0);
    }, [fetchFlights]);

    // 3. Separate useEffect to handle loading MORE pages when 'page' changes
    useEffect(() => {
        // If page is greater than 0, fetch the next page
        if (page > 0) {
            fetchFlights(page);
        }
    }, [page, fetchFlights]);

    const handleNotify = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // Filter and Sort the currently loaded flights
    const filteredFlights = useMemo(() => {
        let result = [...flights];

        if (searchQuery.trim() !== '') {
            result = result.filter(flight =>
                flight.destination.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortOrder === 'asc') {
            result.sort((a, b) => a.destination.localeCompare(b.destination));
        } else if (sortOrder === 'desc') {
            result.sort((a, b) => b.destination.localeCompare(a.destination));
        }

        return result;
    }, [flights, searchQuery, sortOrder]);

    // Intersection Observer Logic
    const observer = useRef<IntersectionObserver | null>(null);

    const lastFlightRef = useCallback((node: HTMLDivElement) => {
        if (loading || loadingMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                // 4. Pure state update: No side-effects inside here anymore!
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    if (loading) return <div className="text-center text-gray-500 mt-10">Loading flights...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Scheduled Flights</h2>

            {notification && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
                    <CheckCircle size={18} /> {notification}
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
                        <option value="default">Sort by City</option>
                        <option value="asc">City: A to Z</option>
                        <option value="desc">City: Z to A</option>
                    </select>
                </div>
            </div>

            {filteredFlights.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <p>No flights found matching "{searchQuery}".</p>
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

            {/* Bottom Loading Spinner */}
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

export default FlightsView;