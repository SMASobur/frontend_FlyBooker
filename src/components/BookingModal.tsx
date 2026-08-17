import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import type { Flight } from '../types';
import { flightApi } from '../api/flightApi';

interface BookingModalProps {
    flight: Flight;
    onClose: () => void;
    onSuccess: () => void; // to refresh the flight list if needed
    onNotify: (message:string)=> void; // for notification.
}

const BookingModal = ({ flight, onClose, onSuccess, onNotify }: BookingModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);


        try {
            await flightApi.bookFlight(flight.id, {
                passengerName: name,
                passengerEmail: email,
            });
            onNotify(`Successfully booked flight ${flight.flightNumber}!`);
            onSuccess(); //Tell the parent view to refresh flights
            onClose();

        } catch (err: any) {
            setError(err.message || 'Failed to book flight. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        Book Flight {flight.flightNumber}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Flight Summary */}
                    <div className="bg-gray-50 rounded-md p-3 mb-4 text-sm">
                        <p className="text-gray-600">
                            Destination: <span className="font-semibold">{flight.destination}</span>
                        </p>
                        <p className="text-gray-500">
                            Price: <span className="font-semibold text-green-600">{flight.price} SEK</span>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                                placeholder="Abdus Sobur Sikdar"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                                placeholder="sikdar@lexicon.com"
                            />
                        </div>

                        {error && (
                            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-md text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 disabled:bg-cyan-400"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Booking...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

};

export default BookingModal;