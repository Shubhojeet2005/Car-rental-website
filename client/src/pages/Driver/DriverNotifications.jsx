import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const DriverNotifications = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/driver-login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'driver') {
        navigate('/');
        return;
      }
      setUser(parsed);
    } catch (_) {
      navigate('/driver-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/user/driver/notifications/${user.id}`);
        const data = await res.json();
        if (res.ok && data.notifications) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user?.id]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/user/driver/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 pt-8 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2">Trip Notifications</h1>
        <p className="text-slate-400 mb-8">
          You will receive a notification when a customer selects you for a trip.
        </p>

        {loading ? (
          <div className="text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-slate-400">No trip notifications yet</p>
            <p className="text-slate-500 text-sm mt-2">When customers book a car and select you as driver, you will see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`bg-slate-800/50 border rounded-xl p-5 transition-colors ${
                  n.read ? 'border-slate-700 opacity-75' : 'border-indigo-500/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{n.message}</p>
                    {n.customerEmail && (
                      <p className="text-slate-400 text-sm mt-1">Customer: {n.customerEmail}</p>
                    )}
                    {n.carName && (
                      <p className="text-slate-400 text-sm">Car: {n.carName}</p>
                    )}
                    {n.pickupDate && (
                      <p className="text-slate-400 text-sm">
                        Pickup: {new Date(n.pickupDate).toLocaleDateString()} at {n.pickupTime}
                      </p>
                    )}
                    <p className="text-slate-500 text-xs mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-white"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverNotifications;
