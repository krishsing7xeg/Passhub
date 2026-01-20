// src/components/visitor/BookingDetailCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, CreditCard, ChevronRight } from 'lucide-react';

const BookingDetailCard = ({ booking }) => {
  const navigate = useNavigate();

  const statusColors = {
    CONFIRMED: 'bg-green-100 text-green-700 border-green-300',
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    CANCELLED: 'bg-red-100 text-red-700 border-red-300'
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div 
      onClick={() => navigate(`/booking/${booking._id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-102 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {booking.place?.name || 'Event'}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(booking.visitDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{booking.place?.location || 'Location'}</span>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-xs text-gray-500">Guests</p>
            <p className="font-semibold text-gray-800">{booking.guestCount || booking.passes?.length || 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Amount</p>
            <p className="font-semibold text-gray-800">
              ₹{booking.totalAmount}
              {booking.totalAmount === 0 && <span className="text-xs text-green-600 ml-1">(Free)</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[booking.status] || statusColors.PENDING}`}>
          {booking.status}
        </span>
        {booking.passes && booking.passes.length > 0 && (
          <span className="text-sm text-gray-600">
            {booking.passes.filter(p => p.status === 'APPROVED').length} passes confirmed
          </span>
        )}
      </div>
    </div>
  );
};

export default BookingDetailCard;