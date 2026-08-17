import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import AvailableFlightsView from './views/AvailableFlightsView';
import BookingsView from './views/BookingsView';
import BookedFlightsView from './views/BookedFlightsView';
import AuthView from './views/AuthView';
import ProfileView from "./views/ProfileView.tsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-slate-50 flex flex-col">
                    <Navbar />
                    <main className="flex-grow container mx-auto px-4 pb-8 w-full">
                        <Routes>
                            <Route path="/" element={<HomeView />} />
                            <Route path="/available" element={<AvailableFlightsView />} />
                            <Route path="/booked" element={<BookedFlightsView />} />
                            <Route path="/bookings" element={<BookingsView />} />
                            <Route path="/login" element={<AuthView />} />
                            <Route path="/profile" element={<ProfileView />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;