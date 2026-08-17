export interface Flight {
    id: number;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string | string[] | number[];
    arrivalTime: string | string[] | number[];
    price: number;
    status?: string;
    passengerName?: string;
    passengerEmail?: string;
}

export interface BookingRequest {
    passengerName: string;
    passengerEmail: string;
}

export interface Booking {
    id: number;
    flightId: number;
    flight?: Flight;
    passengerName: string;
    passengerEmail: string;
    bookingDate: string;
}

export type Role = 'USER' | 'ADMIN';

export interface AuthRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role: Role;
    adminCode?: string;

}

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
    role: Role;
}