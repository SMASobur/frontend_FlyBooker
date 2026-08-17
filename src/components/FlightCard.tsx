import { Plane, Clock, MapPin, Info, ArrowRight } from 'lucide-react';
import type { Flight } from '../types';

interface FlightCardProps {
    flight: Flight;
    onBook?: (flight: Flight) => void;
    onViewDetails?: (flight: Flight) => void;
}

const FlightCard = ({ flight, onBook, onViewDetails }: FlightCardProps) => {
    const formatDate = (dateInput: string | string[] | number[] | undefined) => {
        if (!dateInput) return 'N/A';

        let dateObj: Date;
        if (Array.isArray(dateInput)) {
            const dateArr = dateInput as number[];

            dateObj = new Date(
                dateArr[0],
                dateArr[1] - 1,
                dateArr[2],
                dateArr[3] || 0,
                dateArr[4] || 0,
                dateArr[5] || 0
            );
        } else {
            dateObj = new Date(dateInput);
        }

        if (isNaN(dateObj.getTime())) return 'Invalid Date';

        return dateObj.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (departure: string | string[] | number[], arrival: string | string[] | number[]): string => {
        const parseDate = (input: string | string[] | number[]): Date => {
            if (Array.isArray(input)) {
                const [year, month, day, hours = 0, minutes = 0] = input.map(Number);
                return new Date(year, month - 1, day, hours, minutes);
            }
            return new Date(input);
        };

        const dep = parseDate(departure);
        const arr = parseDate(arrival);

        if (isNaN(dep.getTime()) || isNaN(arr.getTime())) return 'Invalid Date';

        const diffMs = arr.getTime() - dep.getTime();
        if (diffMs < 0) return 'Arrival before departure';

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    const isBooked = flight.status?.toUpperCase() === 'BOOKED';

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Top Section: Flight Number & Price */}
            <div className="flex justify-between items-start p-5 pb-3">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-xl shadow-md shadow-cyan-200">
                        <Plane size={18} className="rotate-90 text-white" />
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Flight</span>
                        <p className="text-lg font-bold text-slate-800 tracking-tight">{flight.flightNumber}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Price</span>
                    <p className="text-2xl font-extrabold text-slate-800">
                        {flight.price} <span className="text-sm font-medium text-slate-500">SEK</span>
                    </p>
                </div>
            </div>

            {/* Route Section: Departure → Destination */}
            <div className="px-5 pb-4">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                        {/* Departure */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                                <Plane size={14} className="text-cyan-600 rotate-90" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium">From</p>
                                <p className="font-bold text-slate-800">Stockholm</p>
                                <p className="text-xs text-slate-500">{formatDate(flight.departureTime)}</p>
                            </div>
                        </div>

                        {/* Arrow */}
                        <ArrowRight size={20} className="text-cyan-400 flex-shrink-0 mx-2" />

                        {/* Destination */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <MapPin size={14} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium">To</p>
                                <p className="font-bold text-slate-800">{flight.destination}</p>
                                <p className="text-xs text-slate-500">{formatDate(flight.arrivalTime)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Duration & Status Row */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/50">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">
                                Duration: {calculateDuration(flight.departureTime, flight.arrivalTime)}
                            </span>
                        </div>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            isBooked
                                ? 'bg-red-50 text-red-600'
                                : 'bg-green-50 text-green-600'
                        }`}>
                            {isBooked ? 'Booked' : 'Available'}
                        </span>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="px-5 pb-5 mt-auto pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                    {isBooked && onViewDetails && (
                        <button
                            onClick={() => onViewDetails(flight)}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            <Info size={16} /> View Details
                        </button>
                    )}

                    {onBook && (
                        <button
                            onClick={() => onBook(flight)}
                            disabled={isBooked}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                                isBooked
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-cyan-600 0 hover:bg-cyan-700 text-white shadow-lg'
                            }`}
                        >
                            {isBooked ? 'Sold Out' : 'Book Flight'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlightCard;