// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { ThemeProvider } from './context/ThemeContext';
// import Header from './components/common/Header';
// import Footer from './components/common/Footer';
// import Home from './pages/public/Home';
// import AuthModal from './components/common/AuthModal';
// import Auth from './pages/public/Auth';
// import EventDetails from './pages/public/EventDetails';
// import VisitorDashboard from './pages/visitor/Dashboard';
// import BookEvent from './pages/visitor/BookEvent';
// import CreateEvent from './pages/visitor/CreateEvent';
// import AdminDashboard from './pages/admin/Dashboard';
// import SecurityLogin from './pages/security/Login';
// import Subscriptions from './pages/shared/Subscriptions';
// import Profile from './pages/shared/Profile';
// import NotFound from './pages/shared/NotFound';

// const App = () => {
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <Router>
//           <Header setShowAuthModal={setShowAuthModal} />
//           <main className="min-h-screen">
//             <Routes>
//               <Route path="/" element={<Home setShowAuthModal={setShowAuthModal} />} />  {/* Pass setter to Home */}
//               <Route path="/auth" element={<Auth />} />
//               <Route path="/places/:placeId" element={<EventDetails />} />
//               <Route path="/dashboard" element={<VisitorDashboard />} />
//               <Route path="/book/:placeId" element={<BookEvent />} />
//               <Route path="/create-event" element={<CreateEvent />} />
//               <Route path="/admin" element={<AdminDashboard />} />
//               <Route path="/security/login" element={<SecurityLogin />} />
//               <Route path="/subscriptions" element={<Subscriptions />} />
//               <Route path="/profile" element={<Profile />} />
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </main>
//           <Footer />
//           <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// };

// export default App;
// src/App.jsx - COMPLETE UPDATED CODE
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/public/Home';
import AuthModal from './components/common/AuthModal';
import Auth from './pages/public/Auth';
import EventDetails from './pages/public/EventDetails';
import VisitorDashboard from './pages/visitor/Dashboard';
import BookEvent from './pages/visitor/BookEvent';
import CreateEvent from './pages/visitor/CreateEvent';
import ManageEvent from './pages/visitor/ManageEvent';
import BookingDetails from './pages/visitor/BookingDetails';
import AdminDashboard from './pages/admin/Dashboard';
import SecurityLogin from './pages/security/Login';
import SecurityDashboard from './pages/security/Dashboard';
import Subscriptions from './pages/shared/Subscriptions';
import Profile from './pages/shared/Profile';
import NotFound from './pages/shared/NotFound';

const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Header setShowAuthModal={setShowAuthModal} />
          <main className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home setShowAuthModal={setShowAuthModal} />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/places/:placeId" element={<EventDetails />} />
              
              {/* Visitor Routes */}
              <Route path="/dashboard" element={<VisitorDashboard />} />
              <Route path="/book/:placeId" element={<BookEvent />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/manage-event/:eventId" element={<ManageEvent />} />
              <Route path="/booking/:bookingId" element={<BookingDetails />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Security Routes */}
              <Route path="/security/login" element={<SecurityLogin />} />
              <Route path="/security/dashboard" element={<SecurityDashboard />} />
              
              {/* Shared Routes */}
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;