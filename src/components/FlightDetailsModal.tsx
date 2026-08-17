import { useState } from 'react';
import { X, Plane, Clock, MapPin, User, Mail, Copy, CheckCircle } from 'lucide-react';
import type { Flight } from '../types';

interface FlightDetailsModalProps {
    flight: Flight;
    onClose: () => void;
}

const FlightDetailsModal = ({ flight, onClose }: FlightDetailsModalProps) => {
    const [copied, setCopied] = useState(false);

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

    const handleCopyEmail = () => {
        if (flight.passengerEmail) {
            navigator.clipboard.writeText(flight.passengerEmail);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Plane size={20} className="rotate-90 text-cyan-600" />
                        Flight Details: {flight.flightNumber}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Flight Info Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={14} /> Destination</p>
                            <p className="font-semibold text-gray-800">{flight.destination}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1"> Price</p>
                            <p className="font-semibold text-green-600">{flight.price} SEK</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={14} /> Departure</p>
                            <p className="font-medium text-gray-700 text-sm">{formatDate(flight.departureTime)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={14} /> Arrival</p>
                            <p className="font-medium text-gray-700 text-sm">{formatDate(flight.arrivalTime)}</p>
                        </div>
                    </div>

                    {/* Passenger Info */}
                    <div className="border border-gray-200 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-3">Passenger Information</h3>

                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-gray-700">
                                <User size={16} className="text-gray-400" />
                                <span className="font-medium">{flight.passengerName || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-sm">{flight.passengerEmail || 'N/A'}</span>
                            </div>

                            {/* Copy Email Button */}
                            {flight.passengerEmail && (
                                <button
                                    onClick={handleCopyEmail}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                        copied ? 'bg-green-100 text-green-700' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle size={14} /> Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} /> Copy Email
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 bg-gray-50 rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-cyan-700 text-white px-6 py-2 rounded-md hover:bg-cyan-900 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlightDetailsModal;