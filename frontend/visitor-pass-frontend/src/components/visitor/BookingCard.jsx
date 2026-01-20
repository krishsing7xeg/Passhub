import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  if (!booking) return null;

  const placeName = booking.place?.name || 'Unknown Event';
  const visitDate = booking.visitDate ? new Date(booking.visitDate).toLocaleDateString() : 'N/A';
  const totalAmount = booking.totalAmount || 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="font-semibold text-lg">{placeName}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Visit Date: {visitDate}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">Guests: {booking.guestCount || booking.passes?.length || 0}</p>
      <p className="text-sm font-semibold">Amount: ₹{totalAmount} {totalAmount === 0 && <span className="text-green-600">(Free)</span>}</p>
      <p className="text-sm">Status: <span className={`font-semibold ${
        booking.status === 'CONFIRMED' ? 'text-green-600' :
        booking.status === 'CANCELLED' ? 'text-red-600' :
        booking.status === 'PENDING' ? 'text-yellow-600' : 'text-gray-600'
      }`}>{booking.status}</span></p>
      {booking.passes && booking.passes.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">Passes: {booking.passes.filter(p => p.status === 'APPROVED').length} confirmed</p>
        </div>
      )}
    </div>
  );
};

export default BookingCard;