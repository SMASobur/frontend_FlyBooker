import type { Flight, Booking, BookingRequest, AuthRequest, RegisterRequest, AuthResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';
const FLIGHTS_URL = `${API_BASE_URL}/flights`;
const AUTH_URL = `${API_BASE_URL}/auth`;

// Helper to get token from local storage
const getToken = () => localStorage.getItem('jwt_token');

// Only add Authorization header if token exists!
const getAuthHeader = (): Record<string, string> => {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    // For 204 No Content (often used in DELETE)
    if (response.status === 204) {
        return undefined as T;
    }
    return response.json() as Promise<T>;
}

// --- AUTH API ---
export const authApi = {
    login: async (data: AuthRequest): Promise<AuthResponse> => {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<AuthResponse>(response);
    },
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<AuthResponse>(response);
    },
};

// --- FLIGHT API ---
export const flightApi = {
    // 1. Get all flights
    getAllFlights: async (): Promise<Flight[]> => {
        const response = await fetch(`${FLIGHTS_URL}`, {
            headers: { ...getAuthHeader() } // Spread the auth header (empty if not logged in)
        });
        return handleResponse<Flight[]>(response);
    },

    // 2. Get available flights
    getAvailableFlights: async (): Promise<Flight[]> => {
        const response = await fetch(`${FLIGHTS_URL}/available`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse<Flight[]>(response);
    },

    // 3. Book a flight
    bookFlight: async (flightId: number, bookingData: BookingRequest): Promise<Booking | void> => {
        const response = await fetch(`${FLIGHTS_URL}/${flightId}/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(), // Booking REQUIRES token
            },
            body: JSON.stringify(bookingData),
        });
        return handleResponse<Booking>(response);
    },

    // 4. Get bookings by email
    getBookingsByEmail: async (email: string): Promise<Booking[]> => {
        const response = await fetch(`${FLIGHTS_URL}/bookings?email=${encodeURIComponent(email)}`, {
            headers: { ...getAuthHeader() } // Looking up bookings REQUIRES token
        });
        return handleResponse<Booking[]>(response);
    },

    // 5. Cancel a booking
    cancelBooking: async (flightId: number, email: string): Promise<void> => {
        const response = await fetch(`${FLIGHTS_URL}/${flightId}/cancel?email=${encodeURIComponent(email)}`, {
            method: 'DELETE',
            headers: { ...getAuthHeader() } // Canceling REQUIRES token
        });
        return handleResponse<void>(response);
    },

};