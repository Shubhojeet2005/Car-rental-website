import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import socket from '../socket';
import { API_URL } from '../config';

function haversine(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371e3; // metres
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d; // meters
}

const LiveTracking = () => {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId');
  const [status, setStatus] = useState('waiting');
  const [driverLoc, setDriverLoc] = useState(null);
  const [customerLoc, setCustomerLoc] = useState(null);
  const watchId = useRef(null);
  const [distanceMeters, setDistanceMeters] = useState(null);

  useEffect(() => {
    // listen for trip accepted
    const onTripAccepted = (data) => {
      if (!tripId || String(data.tripId) !== String(tripId)) return;
      setStatus('accepted');
      // optionally show driver info from data
    };

    const onDriverLoc = (data) => {
      if (!tripId || String(data.tripId) !== String(tripId)) return;
      if (data.lat && data.lng) {
        setDriverLoc({ lat: data.lat, lng: data.lng });
      }
    };

    socket.on('tripAccepted', onTripAccepted);
    socket.on('driverLocationUpdate', onDriverLoc);

    return () => {
      socket.off('tripAccepted', onTripAccepted);
      socket.off('driverLocationUpdate', onDriverLoc);
    };
  }, [tripId]);

  useEffect(() => {
    if (driverLoc && customerLoc) {
      const d = haversine(customerLoc.lat, customerLoc.lng, driverLoc.lat, driverLoc.lng);
      setDistanceMeters(Math.round(d));
    }
  }, [driverLoc, customerLoc]);

  useEffect(() => {
    // when accepted, prompt user to share location and start watchPosition
    if (status === 'accepted') {
      if (!('geolocation' in navigator)) {
        alert('Geolocation not available in your browser');
        return;
      }
      try {
        watchId.current = navigator.geolocation.watchPosition(async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCustomerLoc({ lat, lng });
          // send via socket
          const userData = localStorage.getItem('user');
          const parsed = userData ? JSON.parse(userData) : null;
          socket.emit('customerLocationUpdate', { tripId, customerEmail: parsed?.email, lat, lng, driverId: null });
          // fallback: POST to REST endpoint
          try {
            await fetch(`${API_URL}/user/location/customer`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tripId, customerEmail: parsed?.email, lat, lng })
            });
          } catch (e) {}
        }, (err) => {
          console.error('geo error', err);
        }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 });
      } catch (e) { console.error(e); }
    }

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [status, tripId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 text-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Live Tracking</h2>
        <p className="text-slate-400 mb-4">Trip: {tripId || 'unknown'}</p>

        <p className="mb-2">Status: <strong>{status}</strong></p>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400">Your location</div>
            <div>{customerLoc ? `${customerLoc.lat.toFixed(6)}, ${customerLoc.lng.toFixed(6)}` : 'Not shared yet'}</div>
          </div>

          <div className="p-3 bg-slate-800 rounded">
            <div className="text-xs text-slate-400">Driver location</div>
            <div>{driverLoc ? `${driverLoc.lat.toFixed(6)}, ${driverLoc.lng.toFixed(6)}` : 'No driver location yet'}</div>
          </div>

          <div className="p-3 bg-slate-800 rounded text-center">
            <div className="text-xs text-slate-400">Distance</div>
            <div className="text-xl font-bold">{distanceMeters !== null ? `${(distanceMeters/1000).toFixed(2)} km` : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
