
// import React, { useEffect, useState } from 'react';
// import api from '../../utils/api';
// import EventCard from '../../components/common/EventCard';
// // Optional: For icons, install @heroicons/react and uncomment the imports below
// // import { CheckCircleIcon, UserGroupIcon, CalendarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// const Home = () => {
//   const [events, setEvents] = useState([]);
//   const [featuredEvents, setFeaturedEvents] = useState([]);
//   const [popularEvents, setPopularEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await api.get('/public/home-events');
//         if (res.data.success) {
//           setEvents(res.data.upcomingEvents || []);
//           setFeaturedEvents(res.data.featuredEvents || []);
//           setPopularEvents(res.data.popularEvents || []);
//         }
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
//           <p className="text-xl text-gray-700 font-medium">Loading events...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 px-6 text-center relative overflow-hidden">
//         <div className="absolute inset-0 bg-black opacity-10"></div>
//         <div className="relative z-10 max-w-4xl mx-auto">
//           <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in tracking-tight">
//             Welcome to PassHub
//           </h1>
//           <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8 leading-relaxed">
//             Your ultimate Visitor Pass Management System. Discover events, manage passes, and connect seamlessly.
//           </p>
//           <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg">
//             Get Started
//           </button>
//         </div>
//       </section>

//       <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
//         {/* Featured Events */}
//         {featuredEvents.length > 0 && (
//           <section className="bg-white rounded-xl shadow-xl p-8 animate-fade-in border border-gray-100">
//             <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center border-b-4 border-indigo-300 pb-4">
//               Featured Events
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {featuredEvents.map(event => (
//                 <div key={event._id} className="transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl rounded-lg overflow-hidden">
//                   <EventCard event={event} />
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Popular Events - Horizontal Scroll */}
//         {popularEvents.length > 0 && (
//           <section className="bg-white rounded-xl shadow-xl p-8 animate-fade-in border border-gray-100">
//             <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center border-b-4 border-indigo-300 pb-4">
//               Popular Events
//             </h2>
//             <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-6 pb-4" style={{ height: '320px' }}>
//               {popularEvents.map(event => (
//                 <div key={event._id} className="flex-shrink-0 w-80 snap-center transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl rounded-lg overflow-hidden">
//                   <EventCard event={event} />
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Upcoming Events - Horizontal Scroll */}
//         <section className="bg-white rounded-xl shadow-xl p-8 animate-fade-in border border-gray-100">
//           <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center border-b-4 border-indigo-300 pb-4">
//             Upcoming Events
//           </h2>
//           <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-6 pb-4" style={{ height: '320px' }}>
//             {events.length > 0 ? (
//               events.map(event => (
//                 <div key={event._id} className="flex-shrink-0 w-80 snap-center transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl rounded-lg overflow-hidden">
//                   <EventCard event={event} />
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center flex items-center justify-center w-full h-full text-lg">
//                 No upcoming events at the moment.
//               </p>
//             )}
//           </div>
//         </section>

//         {/* How to Use Section */}
//         <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-xl p-10 animate-fade-in border border-gray-100">
//           <h2 className="text-4xl font-bold mb-10 text-gray-800 text-center">How to Use PassHub</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <article className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
//               <div className="text-5xl mb-4">✅</div>
//               <h3 className="text-xl font-semibold mb-3 text-gray-800">Step 1: Register</h3>
//               <p className="text-gray-600 leading-relaxed">Create your account to get started with managing visitor passes.</p>
//             </article>
//             <article className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
//               <div className="text-5xl mb-4">👥</div>
//               <h3 className="text-xl font-semibold mb-3 text-gray-800">Step 2: Browse Events</h3>
//               <p className="text-gray-600 leading-relaxed">Explore featured, popular, and upcoming events tailored to you.</p>
//             </article>
//             <article className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
//               <div className="text-5xl mb-4">📅</div>
//               <h3 className="text-xl font-semibold mb-3 text-gray-800">Step 3: Book Passes</h3>
//               <p className="text-gray-600 leading-relaxed">Select events and generate secure visitor passes instantly.</p>
//             </article>
//             <article className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
//               <div className="text-5xl mb-4">🛡️</div>
//               <h3 className="text-xl font-semibold mb-3 text-gray-800">Step 4: Enjoy Secure Access</h3>
//               <p className="text-gray-600 leading-relaxed">Use your pass for seamless entry and track your visits.</p>
//             </article>
//           </div>
//         </section>

//         {/* About Us Section */}
//         <section id="about-us" className="bg-white rounded-xl shadow-xl p-10 animate-fade-in border border-gray-100">
//           <h2 className="text-4xl font-bold mb-10 text-gray-800 text-center">About Us</h2>
//           <div className="max-w-5xl mx-auto text-center space-y-6">
//             <p className="text-xl text-gray-700 leading-relaxed">
//               PassHub is a cutting-edge Visitor Pass Management System designed to simplify event access and visitor tracking.
//               Whether you're organizing corporate events, conferences, or public gatherings, our platform ensures secure,
//               efficient, and user-friendly pass generation and management.
//             </p>
//             <p className="text-xl text-gray-700 leading-relaxed">
//               Built with modern technology, PassHub integrates seamlessly with your existing systems, providing real-time
//               analytics, customizable passes, and a hassle-free experience for both organizers and visitors.
//             </p>
//             <p className="text-xl text-gray-700 leading-relaxed">
//               Join thousands of users who trust PassHub for reliable, innovative solutions. Let's make every visit memorable!
//             </p>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import EventCard from '../../components/common/EventCard';

const Home = ({ setShowAuthModal }) => {  // Accept the setter prop
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/public/home-events');
        if (res.data.success) {
          setEvents(res.data.upcomingEvents || []);
          setFeaturedEvents(res.data.featuredEvents || []);
          setPopularEvents(res.data.popularEvents || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/create-event');
    } else {
      setShowAuthModal(true);  // Open modal if not logged in
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Full-Screen Hero Section with Background Image */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"  // Replace with your image URL
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in tracking-tight drop-shadow-lg">
            Welcome to PassHub
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8 leading-relaxed drop-shadow-md">
            Your ultimate Visitor Pass Management System. Discover events, manage passes, and connect seamlessly.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-indigo-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Rest of the Home component remains the same */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20 -mt-16 relative z-20">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="bg-white rounded-xl shadow-2xl p-10 animate-fade-in border border-gray-100 transform hover:scale-102 transition-transform">
            <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center border-b-4 border-indigo-300 pb-4">
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <div key={event._id} className="transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl rounded-lg overflow-hidden">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Events - Horizontal Scroll */}
        {popularEvents.length > 0 && (
          <section className="bg-white rounded-xl shadow-2xl p-10 animate-fade-in border border-gray-100 transform hover:scale-102 transition-transform">
            <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center border-b-4 border-indigo-300 pb-4">
              Popular Events
            </h2>
            <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-6 pb-4" style={{ height: '320px' }}>
              {popularEvents.map(event => (
                <div key={event._id} className="flex-shrink-0 w-80 snap-center transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl rounded-lg overflow-hidden">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events - Horizontal Scroll */}
        <section className="bg-white rounded-xl shadow-2xl p-10 animate-fade-in border border-gray-100 transform hover:scale-102 transition-transform">
          <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center border-b-4 border-indigo-300 pb-4">
            Upcoming Events
          </h2>
          <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-6 pb-4" style={{ height: '320px' }}>
            {events.length > 0 ? (
              events.map(event => (
                <div key={event._id} className="flex-shrink-0 w-80 snap-center transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl rounded-lg overflow-hidden">
                  <EventCard event={event} />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center flex items-center justify-center w-full h-full text-lg">
                No upcoming events at the moment.
              </p>
            )}
          </div>
        </section>

        {/* How to Use Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-2xl p-10 animate-fade-in border border-gray-100 transform hover:scale-102 transition-transform">
          <h2 className="text-4xl font-bold mb-10 text-gray-800 text-center">How to Use PassHub</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 transform hover:scale-105">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Step 1: Register</h3>
              <p className="text-gray-600 leading-relaxed">Create your account to get started with managing visitor passes.</p>
            </article>
            <article className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 transform hover:scale-105">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Step 2: Browse Events</h3>
              <p className="text-gray-600 leading-relaxed">Explore featured, popular, and upcoming events tailored to you.</p>
            </article>
            <article className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 transform hover:scale-105">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Step 3: Book Passes</h3>
              <p className="text-gray-600 leading-relaxed">Select events and generate secure visitor passes instantly.</p>
            </article>
            <article className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 transform hover:scale-105">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Step 4: Enjoy Secure Access</h3>
              <p className="text-gray-600 leading-relaxed">Use your pass for seamless entry and track your visits.</p>
            </article>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about-us" className="bg-white rounded-xl shadow-2xl p-10 animate-fade-in border border-gray-100 transform hover:scale-102 transition-transform">
          <h2 className="text-4xl font-bold mb-10 text-gray-800 text-center">About Us</h2>
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              PassHub is a cutting-edge Visitor Pass Management System designed to simplify event access and visitor tracking.
              Whether you're organizing corporate events, conferences, or public gatherings, our platform ensures secure,
              efficient, and user-friendly pass generation and management.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Built with modern technology, PassHub integrates seamlessly with your existing systems, providing real-time
              analytics, customizable passes, and a hassle-free experience for both organizers and visitors.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Join thousands of users who trust PassHub for reliable, innovative solutions. Let's make every visit memorable!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;