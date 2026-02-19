import React from 'react';
import { Link } from 'react-router-dom';

const DriverRegister = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-lg bg-slate-900/60 border border-slate-700 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-600/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Driver Registration</h1>
        <p className="text-slate-400 mb-6">
          Driver accounts are created by the admin only. Please contact your administrator to get a driver account. Once created, you can log in and receive trip notifications when customers select you.
        </p>
        <Link
          to="/driver-login"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg"
        >
          Driver Login
        </Link>
        <p className="mt-6 text-slate-500 text-sm">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Customer Login</Link>
        </p>
      </div>
    </div>
  );
};

export default DriverRegister;
