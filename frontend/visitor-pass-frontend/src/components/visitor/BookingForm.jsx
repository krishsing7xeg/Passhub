import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const BookingForm = ({ placeId: propPlaceId, visitDate: propVisitDate }) => {
  const { placeId: routePlaceId } = useParams();
  const placeId = propPlaceId || routePlaceId;
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([{ name: '', email: '', phone: '' }]);
  const [visitDate, setVisitDate] = useState(propVisitDate || '');
  const [loading, setLoading] = useState(false);

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
      }
    };
    if (placeId) {
      fetchPlace();
    }
  }, [placeId]);

  const addGuest = () => {
    if (guests.length < 6) {
      setGuests([...guests, { name: '', email: '', phone: '' }]);
    }
  };

  const removeGuest = (index) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const updateGuest = (index, field, value) => {
    const updated = [...guests];
    updated[index] = { ...updated[index], [field]: value };
    setGuests(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitDate) {
      alert('Please select a visit date');
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/passes/request', { 
        placeId, 
        visitDate,
        guests: guests.filter(g => g.name.trim() !== '')
      });
      
      if (res.data.success) {
        if (res.data.amountToPay > 0) {
          alert(`Booking created! Amount to pay: ₹${res.data.amountToPay}. Please proceed to payment.`);
          // TODO: Redirect to payment page
        } else {
          alert('Booking confirmed! Free passes have been generated.');
        }
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="p-6 text-center">Loading event details...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book for {event.name}</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Visit Date</label>
        <input 
          type="date" 
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-2 border rounded"
          required 
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold">Guests (Max 6)</label>
          {guests.length < 6 && (
            <button 
              type="button"
              onClick={addGuest}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Guest
            </button>
          )}
        </div>
        {guests.map((guest, i) => (
          <div key={i} className="mb-3 p-3 border rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Guest {i + 1}</span>
              {guests.length > 1 && (
                <button 
                  type="button"
                  onClick={() => removeGuest(i)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <input 
              placeholder="Name *" 
              value={guest.name} 
              onChange={(e) => updateGuest(i, 'name', e.target.value)} 
              className="w-full p-2 border rounded mb-2"
              required 
            />
            <input 
              type="email"
              placeholder="Email" 
              value={guest.email} 
              onChange={(e) => updateGuest(i, 'email', e.target.value)} 
              className="w-full p-2 border rounded mb-2"
            />
            <input 
              type="tel"
              placeholder="Phone" 
              value={guest.phone} 
              onChange={(e) => updateGuest(i, 'phone', e.target.value)} 
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>

      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p className="font-semibold">Total Amount: ₹{event.price * guests.filter(g => g.name.trim()).length}</p>
        {event.price === 0 && <p className="text-sm text-green-600">This is a free event!</p>}
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Creating Booking...' : 'Book Now'}
      </button>
    </form>
  );
};

export default BookingForm;