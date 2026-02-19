import React from 'react';
import { Link } from 'react-router-dom';

const DriverCarPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-lg bg-slate-900/60 border border-slate-700 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Car Management</h2>
        <p className="text-slate-400 mb-6">
          Cars are now added and managed by the admin. Please contact your admin to add or update car listings.
        </p>
        <Link to="/driver/notifications" className="text-indigo-400 hover:text-indigo-300 font-medium">
          View Trip Notifications →
        </Link>
      </div>
    </div>
  );
};

export default DriverCarPage;