import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { flightApi } from '../api/flightApi';
import type { Flight } from '../types';
import { Search, Trash2, AlertCircle, CheckCircle, Loader2, Plane, X, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';

const BookingsView = () => {
    const { isAuthenticated, email, role } = useAuth();

    const isAdmin = role === 'ADMIN';

    const [searchEmail, setSearchEmail] = useState('');
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    // New state for Admin real-time search
    const [adminSearchQuery, setAdminSearchQuery] = useState('');

    // For cancel loading state
    const [cancelingId, setCancelingId] = useState<number | null>(null);

    // for success notifications
    const [notification, setNotification] = useState<string | null>(null);
    const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

    // Fetch bookings for a specific email
    const fetchBookingsByEmail = async (emailToSearch: string) => {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            const data = await flightApi.getBookingsByEmail(emailToSearch.trim());
            setBookings(data as unknown as Flight[]);
        } catch (err) {
            setError('Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch ALL booked flights (For Admins)
    const fetchAllBookedFlights = async () => {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            const allFlights = await flightApi.getAllFlights();
            const bookedOnly = allFlights.filter(flight => flight.status?.toUpperCase() === 'BOOKED');
            setBookings(bookedOnly);
        } catch (err) {
            setError('Failed to fetch all bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Admin: Automatically load ALL booked flights
        if (isAuthenticated && role === 'ADMIN') {
            fetchAllBookedFlights();
        }
        // Regular User: Automatically load THEIR bookings
        else if (isAuthenticated && role === 'USER' && email) {
            setSearchEmail(email);
            fetchBookingsByEmail(email);
        }
    }, [isAuthenticated, email, role]);

    // Real-time filtering for Admin search bar
    const displayedBookings = useMemo(() => {
        if (!isAdmin || !adminSearchQuery.trim()) return bookings;

        const query = adminSearchQuery.toLowerCase();
        return bookings.filter(booking =>
            booking.destination?.toLowerCase().includes(query) ||
            booking.flightNumber?.toLowerCase().includes(query) ||
            booking.passengerEmail?.toLowerCase().includes(query) ||
            booking.passengerName?.toLowerCase().includes(query)
        );
    }, [bookings, isAdmin, adminSearchQuery]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchEmail) return;
        fetchBookingsByEmail(searchEmail);
    };

    const handleClearSearch = () => {
        setSearchEmail('');
        setBookings([]);
        setHasSearched(false);
        setError(null);

        // If an admin clears the search, reload ALL bookings
        if (isAuthenticated && role === 'ADMIN') {
            fetchAllBookedFlights();
        }
    };

    const handleCancel = async () => {
        if (!confirmCancelId) return;

        setCancelingId(confirmCancelId);
        setError(null);

        try {
            // If admin is canceling from the global list, we don't necessarily have the email in the search bar.
            // We can extract it directly from the booking object!
            const bookingToCancel = bookings.find(b => b.id === confirmCancelId);
            const emailForCancel = bookingToCancel?.passengerEmail || searchEmail;

            await flightApi.cancelBooking(confirmCancelId, emailForCancel);
            setNotification('Booking successfully canceled!');
            setTimeout(() => setNotification(null), 3000);

            // remove the canceled flight from the list instantly
            setBookings(prev => prev.filter(f => f.id !== confirmCancelId));
        } catch (err: any) {
            setError(err.message || 'Failed to cancel booking.');
        } finally {
            setCancelingId(null);
            setConfirmCancelId(null);
        }
    };

    const formatDate = (dateInput: string | string[] | number[] | undefined) => {
        if (!dateInput) return 'N/A';
        let dateObj;
        if (Array.isArray(dateInput)) {
            const dateArr = dateInput as number[];
            dateObj = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3] || 0, dateArr[4] || 0, dateArr[5] || 0);
        } else {
            dateObj = new Date(dateInput);
        }
        return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {role === 'ADMIN' ? <ShieldCheck size={24} className="text-indigo-500" /> : <Plane size={24} className="text-cyan-500" />}
                Manage Bookings
            </h2>

            {/* Notification Banner */}
            {notification && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
                    <CheckCircle size={18} /> {notification}
                </div>
            )}

            {/* Conditional Search Bars */}
            {isAdmin ? (
                /* Admin Search Bar (Real-time filter) */
                <div className="mb-8 max-w-lg relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                        placeholder="Filter by destination, flight no, name, or email..."
                    />
                </div>
            ) : (
                /* User/Guest Search Bar */
                <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-lg">
                    <input
                        type="email"
                        required
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="flex-grow border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                        placeholder="Enter email to find bookings"
                    />
                    <button type="submit" disabled={loading} className="bg-cyan-500 text-slate-900 px-4 py-2 rounded-md hover:bg-cyan-400 transition-colors flex items-center gap-2 disabled:bg-blue-400 font-medium">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Search
                    </button>
                    {hasSearched && (
                        <button type="button" onClick={handleClearSearch} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 transition-colors flex items-center gap-2">
                            <X size={18} /> Clear
                        </button>
                    )}
                </form>
            )}

            {error && (
                <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md max-w-lg">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {/* Results Area */}
            {hasSearched && !loading && displayedBookings.length === 0 ? (
                <div className="text-center text-slate-500 mt-10 bg-white p-8 rounded-lg shadow-sm border border-slate-100 max-w-lg mx-auto">
                    <AlertCircle size={32} className="mx-auto mb-3 text-slate-400" />
                    <p className="mb-4">
                        {isAdmin && adminSearchQuery
                            ? `No bookings match "${adminSearchQuery}".`
                            : `No bookings found for ${searchEmail}.`}
                    </p>
                    {!isAdmin && (
                        <Link to="/available" className="inline-flex items-center gap-2 bg-cyan-500 text-slate-900 px-4 py-2 rounded-md hover:bg-cyan-400 transition-colors text-sm font-medium">
                            <PlaneTakeoff size={16} /> Book a Flight
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-md border border-slate-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-cyan-50 p-3 rounded-full">
                                    <Plane size={24} className="text-cyan-600 rotate-90" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{booking.flightNumber}</h3>
                                    <p className="text-sm text-slate-600">Destination: <span className="font-medium">{booking.destination}</span></p>
                                    <p className="text-xs text-slate-500 mt-1">Departing: {formatDate(booking.departureTime)}</p>
                                </div>
                            </div>
                            <div className="text-sm text-slate-600 md:text-right">
                                <p className="font-medium text-slate-800">{booking.passengerName}</p>
                                <p>{booking.passengerEmail}</p>
                                <p className="text-xs text-green-600 font-medium mt-1">Status: {booking.status}</p>
                            </div>
                            <button
                                onClick={() => setConfirmCancelId(booking.id)}
                                className="text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium w-full md:w-auto justify-center"
                            >
                                <Trash2 size={16} /> Cancel Booking
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={confirmCancelId !== null}
                onClose={() => setConfirmCancelId(null)}
                onConfirm={handleCancel}
                title="Cancel this booking?"
                message="Are you sure you want to cancel this flight? This action cannot be undone."
                confirmButtonText="Yes, Cancel"
                cancelButtonText="Keep Booking"
                loading={cancelingId !== null}
                variant="danger"
            />
        </div>
    );
};

export default BookingsView;