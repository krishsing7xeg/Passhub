// src/pages/visitor/ManageEvent.jsx - COMPLETE UPDATE
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, ToggleLeft, ToggleRight, Shield, UserPlus, Settings as SettingsIcon } from 'lucide-react';
import api from '../../utils/api';
import BackButton from '../../components/common/BackButton';
import SecurityPersonnelCard from '../../components/visitor/SecurityPersonnelCard';
import ConfirmModal from '../../components/common/ConfirmModal';

const ManageEvent = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [security, setSecurity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [assignmentPeriod, setAssignmentPeriod] = useState({ start: '', end: '' });
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [updateForm, setUpdateForm] = useState({ capacity: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      const [dashboardRes, securityRes] = await Promise.all([
        api.get(`/host/places/${eventId}/dashboard`),
        api.get(`/host/places/${eventId}/security`)  // Assuming this endpoint exists
      ]);

      if (dashboardRes.data.success) {
        setEvent(dashboardRes.data.dashboard);
        setUpdateForm({
          capacity: dashboardRes.data.dashboard.place.capacity,
          startDate: dashboardRes.data.dashboard.eventDates.start.split('T')[0],
          endDate: dashboardRes.data.dashboard.eventDates.end.split('T')[0]
        });
      }
      
      // Security data might come from dashboard or separate endpoint
      if (securityRes.data.security) {
        setSecurity(securityRes.data.security);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBooking = async () => {
    try {
      const res = await api.post(`/host/places/${eventId}/toggle-booking`, {
        reason: 'Manual toggle by host'
      });
      if (res.data.success) {
        fetchEventData();
        alert(`Booking ${event.place.isBookingEnabled ? 'disabled' : 'enabled'} successfully`);
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
    setShowToggleConfirm(false);
  };

  const handleUpdateCapacity = async () => {
    try {
      const res = await api.put(`/host/places/${eventId}/capacity`, {
        dailyCapacity: parseInt(updateForm.capacity)
      });
      if (res.data.success) {
        fetchEventData();
        alert('Capacity updated successfully');
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateDates = async () => {
    try {
      const res = await api.put(`/host/events/${eventId}/dates`, {
        date: updateForm.startDate
      });
      if (res.data.success) {
        fetchEventData();
        alert('Event dates updated successfully');
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleInviteSecurity = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/host/places/${eventId}/invite-security`, {
        email: inviteEmail,
        assignmentPeriod
      });
      if (res.data.success) {
        alert('Security invited successfully!');
        setInviteEmail('');
        setAssignmentPeriod({ start: '', end: '' });
        setShowInviteForm(false);
        fetchEventData();
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveSecurity = async (securityId) => {
    try {
      const res = await api.delete(`/host/places/${eventId}/security/${securityId}`);
      if (res.data.success) {
        alert('Security removed successfully');
        fetchEventData();
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center"><p>Event not found</p></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <BackButton to="/dashboard" />

        {/* Header with Booking Toggle */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.place.name}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{event.place.location}</span>
              </div>
            </div>
            <button
              onClick={() => setShowToggleConfirm(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                event.place.isBookingEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {event.place.isBookingEnabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              Booking {event.place.isBookingEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <Users className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{event.stats.approvedPasses}</p>
            <p className="text-indigo-100">Total Bookings</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <DollarSign className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">₹{event.stats.totalRevenue || 0}</p>
            <p className="text-green-100">Revenue</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <Calendar className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{event.stats.todayPasses}</p>
            <p className="text-orange-100">Today's Visitors</p>
          </div>
        </div>

        {/* Update Forms */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Update Capacity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-indigo-600" />
              Update Capacity
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Capacity</label>
                <input
                  type="number"
                  value={updateForm.capacity}
                  onChange={(e) => setUpdateForm({ ...updateForm, capacity: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  min="1"
                />
              </div>
              <button
                onClick={handleUpdateCapacity}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Update Capacity
              </button>
            </div>
          </div>

          {/* Update Event Dates */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Update Event Dates
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={updateForm.startDate}
                  onChange={(e) => setUpdateForm({ ...updateForm, startDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleUpdateDates}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Update Dates
              </button>
            </div>
          </div>
        </div>

        {/* Security Personnel Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-7 h-7 text-indigo-600" />
              Security Personnel
            </h3>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              Invite Security
            </button>
          </div>

          {showInviteForm && (
            <form onSubmit={handleInviteSecurity} className="mb-6 p-4 bg-indigo-50 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="email"
                  placeholder="Security Email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
                <input
                  type="date"
                  placeholder="Start Date"
                  value={assignmentPeriod.start}
                  onChange={(e) => setAssignmentPeriod({ ...assignmentPeriod, start: e.target.value })}
                  className="p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={assignmentPeriod.end}
                  onChange={(e) => setAssignmentPeriod({ ...assignmentPeriod, end: e.target.value })}
                  className="p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-3 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Send Invitation
              </button>
            </form>
          )}

          {security.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {security.map((sec) => (
                <SecurityPersonnelCard 
                  key={sec._id} 
                  security={sec} 
                  onRemove={handleRemoveSecurity}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No security personnel assigned yet.</p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showToggleConfirm}
        title={`${event.place.isBookingEnabled ? 'Disable' : 'Enable'} Booking`}
        message={`Are you sure you want to ${event.place.isBookingEnabled ? 'disable' : 'enable'} booking for this event?`}
        onConfirm={handleToggleBooking}
        onCancel={() => setShowToggleConfirm(false)}
        confirmText={event.place.isBookingEnabled ? 'Disable' : 'Enable'}
        type={event.place.isBookingEnabled ? 'warning' : 'success'}
      />
    </div>
  );
};

export default ManageEvent;