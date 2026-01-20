// src/components/visitor/EventForm.jsx - UPDATED
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  MapPinIcon,
  PhotoIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const EventForm = ({ onSuccess }) => {  // ✅ Added onSuccess prop
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    location: '',
    image: '',
    eventDates: { start: '', end: '' },
    price: 0,
    dailyCapacity: 100,
    refundPolicy: {
      isRefundable: true,
      beforeVisitPercent: 80,
      sameDayPercent: 50,
      description: 'Standard refund policy',
    },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Check subscription validity
    if (!user?.subscription?.isActive) {
      alert('You need an active subscription to create events');
      navigate('/subscriptions');
      return;
    }

    // ✅ Check if event dates are within subscription period
    const eventStart = new Date(form.eventDates.start);
    const eventEnd = new Date(form.eventDates.end);
    const subStart = new Date(user.subscription.startDate);
    const subEnd = new Date(user.subscription.endDate);

    if (eventStart < subStart || eventEnd > subEnd) {
      // Calculate event duration
      const durationDays = Math.ceil((eventEnd - eventStart) / (1000 * 60 * 60 * 24)) + 1;
      
      alert(`Your event dates exceed your subscription period. Please purchase a subscription that covers ${durationDays} days.`);
      navigate('/subscriptions', { state: { eventDuration: durationDays } });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/host/place', form);
      if (res.data.success) {
        // ✅ Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(res.data.place);
        } else {
          // Fallback if onSuccess not provided
          alert('Event created successfully!');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b-2 border-indigo-200 pb-4">
        Create New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name *</label>
          <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition">
            <span className="pl-3 text-gray-500">🎉</span>
            <input
              placeholder="Enter event name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 pl-2 border-0 rounded-xl focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
          <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition">
            <MapPinIcon className="h-5 w-5 text-gray-500 ml-3" />
            <input
              placeholder="Enter location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full p-3 pl-2 border-0 rounded-xl focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
          <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition">
            <PhotoIcon className="h-5 w-5 text-gray-500 ml-3" />
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full p-3 pl-2 border-0 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        {/* Event Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
            <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <CalendarIcon className="h-5 w-5 text-gray-500 ml-3" />
              <input
                type="date"
                value={form.eventDates.start}
                onChange={(e) => setForm({ ...form, eventDates: { ...form.eventDates, start: e.target.value } })}
                className="w-full p-3 pl-2 border-0 rounded-xl focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
            <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <CalendarIcon className="h-5 w-5 text-gray-500 ml-3" />
              <input
                type="date"
                value={form.eventDates.end}
                onChange={(e) => setForm({ ...form, eventDates: { ...form.eventDates, end: e.target.value } })}
                className="w-full p-3 pl-2 border-0 rounded-xl focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Price and Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
            <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <CurrencyRupeeIcon className="h-5 w-5 text-gray-500 ml-3" />
              <input
                type="number"
                placeholder="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                className="w-full p-3 pl-2 border-0 rounded-xl focus:outline-none"
                min="0"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Capacity *</label>
            <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <UsersIcon className="h-5 w-5 text-gray-500 ml-3" />
              <input
                type="number"
                placeholder="100"
                value={form.dailyCapacity}
                onChange={(e) => setForm({ ...form, dailyCapacity: parseInt(e.target.value) || 100 })}
                className="w-full p-3 pl-2 border-0 rounded-xl focus:outline-none"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-gray-600 mr-2" />
            <label className="text-lg font-semibold text-gray-700">Refund Policy</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={form.refundPolicy.isRefundable}
              onChange={(e) => setForm({
                ...form,
                refundPolicy: { ...form.refundPolicy, isRefundable: e.target.checked },
              })}
              className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">Enable refunds</span>
          </div>
          {form.refundPolicy.isRefundable && (
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Before Visit Refund (%):</label>
                <input
                  type="number"
                  placeholder="80"
                  value={form.refundPolicy.beforeVisitPercent}
                  onChange={(e) => setForm({
                    ...form,
                    refundPolicy: { ...form.refundPolicy, beforeVisitPercent: parseInt(e.target.value) || 80 },
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  min="0"
                  max="100"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Same Day Refund (%):</label>
                <input
                  type="number"
                  placeholder="50"
                  value={form.refundPolicy.sameDayPercent}
                  onChange={(e) => setForm({
                    ...form,
                    refundPolicy: { ...form.refundPolicy, sameDayPercent: parseInt(e.target.value) || 50 },
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Event...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </form>
    </div>
  );
};

export default EventForm;