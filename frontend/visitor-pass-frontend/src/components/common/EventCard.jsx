import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  
  // Handle both event structure from public API and direct place structure
  const eventName = event.title || event.name;
  const eventImage = event.place?.images?.[0] || event.image;
  const eventLocation = event.place?.city || event.location;
  const eventPrice = event.price || 0;
  const availableSeats = event.availableSeats || event.remainingCapacity;
  const totalCapacity = event.totalCapacity || event.dailyCapacity;
  const eventId = event._id || event.id;
  const eventDate = event.date || event.eventDates?.start;
  const endDate = event.endDate || event.eventDates?.end;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <img 
        src={eventImage || '/qr-placeholder.png'} 
        alt={eventName} 
        className="w-full h-32 object-cover rounded mb-2" 
        onError={(e) => {
          e.target.src = '/qr-placeholder.png';
        }}
      />
      <h3 className="text-lg font-bold mt-2">{eventName}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{eventLocation}</p>
      {eventDate && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(eventDate)}
          {endDate && eventDate !== endDate && ` - ${formatDate(endDate)}`}
        </p>
      )}
      <p className="text-sm font-semibold mt-1">
        ₹{eventPrice} {eventPrice === 0 && <span className="text-green-600">(Free)</span>}
      </p>
      <p className="text-sm text-gray-500">
        {availableSeats !== undefined && totalCapacity !== undefined
          ? `Seats: ${availableSeats}/${totalCapacity}`
          : `Capacity: ${totalCapacity || 'N/A'}`}
      </p>
      <div className="mt-4 flex gap-2">
        <button 
          onClick={() => navigate(`/book/${eventId}`)} 
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Book Now
        </button>
        <button 
          onClick={() => navigate(`/places/${eventId}`)} 
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;