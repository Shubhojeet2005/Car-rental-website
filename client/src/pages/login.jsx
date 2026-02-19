import React, { use, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toggle,setToggle]= useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.errors?.[0]?.msg || 'Login failed');
        return;
      }
      // Success: store user info if needed, then redirect
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userLogin'));
      }
      window.location.href = '/';
    } catch (err) {
      setError('Network error. Is the backend running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
<div className="flex flex-col items-center justify-center">
  
</div>
      <div className="relative w-full max-w-lg">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">

          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-400 rounded-2xl rotate-12 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <svg className="w-8 h-8 text-white -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-400 font-medium">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/[0.07] outline-none transition-all px-5 py-4"
                placeholder="example@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/[0.07] outline-none transition-all px-5 py-4"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl text-sm px-6 py-4 transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.98]"
            >
              <span>{loading ? 'Signing in...' : 'Sign Into Account'}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm font-medium">
              New here? <Link to="/register" className="text-white hover:text-indigo-400 underline underline-offset-4 decoration-indigo-500/50 transition-colors">Create an account</Link>
            </p>
            <p><Link to="/driver-register" className="text-white hover:text-indigo-400 underline underline-offset-4 decoration-indigo-500/50 transition-colors">Create a Driver account</Link></p>
            <p><Link to="/driver-login" className="text-white hover:text-indigo-400 underline underline-offset-4 decoration-indigo-500/50 transition-colors">Login as a Driver</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
