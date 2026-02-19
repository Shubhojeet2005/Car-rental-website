import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { carsData } from './Cars';
import PlaceInputWithMap from '../components/PlaceInputWithMap';
import { API_URL } from '../config';

const CarDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState(['']); 
  const [car, setCar] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [loadingCar, setLoadingCar] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    // Try to find in static data first
    const localCar = carsData.find((c) => String(c.id) === String(id));
    if (localCar) {
      setCar(localCar);
      setLoadingCar(false);
      return;
    }

    const fetchCar = async () => {
      try {
        const res = await fetch(`${API_URL}/user/drivercars/${id}`);
        const data = await res.json();
        if (res.ok && data.car) {
          const img = data.car.image?.startsWith('/') ? `${API_URL}${data.car.image}` : data.car.image;
          setCar({
            id: data.car._id,
            name: data.car.name,
            image: img,
            charges: data.car.charges ?? 0,
            driver: data.car.driver ? { name: data.car.driver.firstname ? `${data.car.driver.firstname} ${data.car.driver.lastname || ''}`.trim() : data.car.driver.name } : null,
          });
        } else {
          setCar(null);
        }
      } catch (err) {
        console.error('Error fetching car details:', err);
        setCar(null);
      } finally {
        setLoadingCar(false);
      }
    };

    fetchCar();
  }, [id]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${API_URL}/user/drivers`);
        const data = await res.json();
        if (res.ok && data.drivers) {
          setDrivers(data.drivers);
          if (data.drivers.length > 0 && !selectedDriverId) {
            setSelectedDriverId(data.drivers[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching drivers:', err);
      } finally {
        setLoadingDrivers(false);
      }
    };
    fetchDrivers();
  }, []);

  // Handlers for dynamic places
  const handleAddPlace = () => {
    setPlaces([...places, '']); // Add a new empty string to the array
  };

  const handleRemovePlace = (index) => {
    const newPlaces = places.filter((_, i) => i !== index);
    setPlaces(newPlaces);
  };

  const handlePlaceChange = (index, value) => {
    const newPlaces = [...places];
    newPlaces[index] = value;
    setPlaces(newPlaces);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDriverId) {
      alert('Please select a driver');
      return;
    }
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.itinerary = places.filter(p => p.trim() !== '');
    data.driverId = selectedDriverId;
    try {
      const res = await fetch(`${API_URL}/user/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Booking failed');
      alert(result.message || 'Car booked successfully!');
    } catch (err) {
      console.error('Booking error:', err);
      alert(err.message || 'Failed to save booking. Please try again.');
    }
  };

  if (loadingCar) return <div className="text-white p-10">Loading car...</div>;
  if (!car) return <div className="text-white p-10">Car not found.</div>;

  return (
    <div className='car-details-container max-w-2xl mx-auto p-6 bg-slate-900 text-white rounded-xl shadow-2xl my-10'>
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Booking: {car.name}</h1>
      
      <div className="mb-8 overflow-hidden rounded-lg border border-slate-700">
        <img src={car.image} alt={car.name} className="w-full h-64 object-cover" />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">Car Model</label>
          <input type="text" name="carName" className="bg-slate-800 p-2 rounded border border-slate-700" value={car.name} readOnly />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="text-xs text-slate-400 mb-1">Select Driver *</label>
          <select
            name="driverId"
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="bg-slate-800 p-2 rounded border border-slate-700 text-white"
            required
          >
            <option value="">-- Choose a driver --</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.firstname} {d.lastname} - {d.phone}
              </option>
            ))}
          </select>
          {loadingDrivers && <span className="text-xs text-slate-500 mt-1">Loading drivers...</span>}
          {!loadingDrivers && drivers.length === 0 && (
            <span className="text-xs text-amber-400 mt-1">No drivers available. Admin must add drivers first.</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">Email Address</label>
          <input type="email" name="email" className="bg-slate-800 p-2 rounded border border-slate-700" value={user?.email || ''} readOnly />
        </div>

        {/* Dynamic Places Section */}
        <div className="flex flex-col md:col-span-2 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400">Travel Itinerary (Places)</label>
            <button 
              type="button" 
              onClick={handleAddPlace}
              className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 px-2 py-1 rounded transition-colors"
            >
              <span className="text-lg font-bold">+</span> Add Place
            </button>
          </div>
          
          <div className="space-y-2">
            {places.map((place, index) => (
              <PlaceInputWithMap
                key={index}
                value={place}
                onChange={(value) => handlePlaceChange(index, value)}
                placeholder={`Search or pick on map — Place ${index + 1}`}
                onRemove={() => handleRemovePlace(index)}
                showRemove={places.length > 1}
              />
            ))}
          </div>
        </div>

        {/* Date, Time, Duration */}
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">Pickup Date</label>
          <input type="date" name="date" className="bg-slate-800 p-2 rounded border border-slate-700" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">Pickup Time</label>
          <input type="time" name="time" className="bg-slate-800 p-2 rounded border border-slate-700" defaultValue="10:00" />
        </div>

        <button 
          type='submit' 
          className="md:col-span-2 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-all active:scale-95 shadow-lg"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default CarDetails;