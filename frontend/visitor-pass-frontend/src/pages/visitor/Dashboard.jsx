// src/pages/visitor/Dashboard.jsx - COMPLETE UPDATE
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { User, MoreVertical, Camera, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import TabNavigation from '../../components/common/TabNavigation';
import BookingDetailCard from '../../components/visitor/BookingDetailCard';
import PassCard from '../../components/visitor/PassCard';
import EventManagementCard from '../../components/visitor/EventManagementCard';
import ProfilePictureUpload from '../../components/common/ProfilePictureUpload';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [passes, setPasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      fetchData();
      loadProfilePicture();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [passesRes, bookingsRes, eventsRes] = await Promise.all([
        api.get('/passes/my-passes'),
        api.get('/passes/bookings'),
        user?.subscription?.isActive ? api.get('/host/events') : Promise.resolve({ data: { success: true, events: [] } })
      ]);

      if (passesRes.data.success) setPasses(passesRes.data.passes || []);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings || []);
      if (eventsRes.data.success) setEvents(eventsRes.data.events || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfilePicture = () => {
    const savedPicture = localStorage.getItem(`profile_picture_${user.id}`);
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  };

  const handleProfilePictureUpdate = async (imageData) => {
    localStorage.setItem(`profile_picture_${user.id}`, imageData);
    setProfilePicture(imageData);
  };

  const tabs = [
    { id: 'bookings', label: 'My Bookings', count: bookings.length },
    { id: 'passes', label: 'Active Passes', count: passes.length },
    ...(user?.subscription?.isActive ? [{ id: 'events', label: 'My Events', count: events.length }] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 relative">
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-200">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-indigo-400" />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">{user?.email}</p>
              {user?.subscription?.isActive && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Subscription Active ({user.subscription.daysRemaining || 0} days left)
                </div>
              )}
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-6 h-6 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowProfileUpload(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors flex items-center gap-3 text-gray-700"
                  >
                    <ImageIcon className="w-5 h-5 text-indigo-600" />
                    Set Profile Picture
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors flex items-center gap-3 text-gray-700 border-t border-gray-100"
                  >
                    <User className="w-5 h-5 text-indigo-600" />
                    View Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="space-y-6">
          {/* My Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
              {bookings.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking) => (
                    <BookingDetailCard key={booking._id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                  <p className="text-gray-500 text-lg">No bookings yet. Start exploring events!</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold"
                  >
                    Browse Events
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Passes Tab */}
          {activeTab === 'passes' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Passes</h2>
              {passes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {passes.map((pass) => (
                    <PassCard key={pass._id} pass={pass} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                  <p className="text-gray-500 text-lg">No active passes at the moment.</p>
                </div>
              )}
            </div>
          )}

          {/* My Events Tab */}
          {activeTab === 'events' && user?.subscription?.isActive && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Hosted Events</h2>
                <button
                  onClick={() => navigate('/create-event')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg transform hover:scale-105"
                >
                  + Create Event
                </button>
              </div>

              {events.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventManagementCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                  <p className="text-gray-500 text-lg mb-4">No hosted events yet. Create your first event!</p>
                  <button
                    onClick={() => navigate('/create-event')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold"
                  >
                    Create Event
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Picture Upload Modal */}
      {showProfileUpload && (
        <ProfilePictureUpload
          currentImage={profilePicture}
          onImageUpdate={handleProfilePictureUpdate}
          onClose={() => setShowProfileUpload(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;