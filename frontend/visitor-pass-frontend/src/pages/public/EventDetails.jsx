import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const EventDetails = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await api.get(`/places/${placeId}`);
        if (res.data.success) {
          setEvent(res.data.place);
        }
      } catch (error) {
        console.error('Error fetching place:', error);
        alert('Error loading event details');
      } finally {
        setLoading(false);
      }
    };
    
    if (placeId) {
      fetchPlace();
    }
  }, [placeId]);

  if (loading) return <div className="p-6 text-center">Loading event details...</div>;
  if (!event) return <div className="p-6 text-center">Event not found</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      
      {event.image && (
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-96 object-cover rounded-lg mb-4"
          onError={(e) => {
            e.target.src = '/qr-placeholder.png';
          }}
        />
      )}
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {event.description || `Join us for an amazing event at ${event.name}!`}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold">Location:</p>
            <p className="text-gray-600 dark:text-gray-400">{event.location}</p>
          </div>
          <div>
            <p className="font-semibold">Price:</p>
            <p className="text-gray-600 dark:text-gray-400">
              ₹{event.price} {event.price === 0 && <span className="text-green-600">(Free Event)</span>}
            </p>
          </div>
          <div>
            <p className="font-semibold">Start Date:</p>
            <p className="text-gray-600 dark:text-gray-400">
              {formatDate(event.eventDates?.start)}
            </p>
          </div>
          <div>
            <p className="font-semibold">End Date:</p>
            <p className="text-gray-600 dark:text-gray-400">
              {formatDate(event.eventDates?.end)}
            </p>
          </div>
          <div>
            <p className="font-semibold">Capacity:</p>
            <p className="text-gray-600 dark:text-gray-400">
              {event.remainingCapacity || 0} / {event.dailyCapacity} seats available
            </p>
          </div>
          <div>
            <p className="font-semibold">Booking Status:</p>
            <p className={event.isBookingEnabled ? 'text-green-600' : 'text-red-600'}>
              {event.isBookingEnabled ? 'Open for Booking' : 'Booking Closed'}
            </p>
          </div>
        </div>

        {event.refundPolicy && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="font-semibold mb-2">Refund Policy:</p>
            {event.refundPolicy.isRefundable ? (
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                <li>Before visit: {event.refundPolicy.beforeVisitPercent}% refund</li>
                <li>Same day: {event.refundPolicy.sameDayPercent}% refund</li>
                {event.refundPolicy.description && (
                  <li className="mt-2">{event.refundPolicy.description}</li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">No refunds available for this event.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {event.isBookingEnabled && (
          <button 
            onClick={() => navigate(`/book/${placeId}`)} 
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        )}
        <button 
          onClick={() => navigate('/security/login')} 
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors"
        >
          Enter as Security
        </button>
      </div>
    </div>
  );
};

export default EventDetails;