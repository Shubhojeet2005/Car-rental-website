import React, { useState } from 'react';

const API_URL = 'http://localhost:3000';

const DriverCarDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    charges: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.image) {
      setError('Please upload a car image');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('charges', formData.charges);
      data.append('description', formData.description);
      data.append('image', formData.image);

      const res = await fetch(`${API_URL}/user/drivercars`, {
        method: 'POST',
        body: data,
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.message || json.errors?.[0]?.msg || 'Failed to save car details');
        return;
      }

      setSuccess('Car details saved successfully');
      setFormData({
        name: '',
        charges: '',
        description: '',
        image: null,
      });
    } catch (err) {
      setError('Network error. Is the backend running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Add Your Car</h1>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
              Car Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/[0.08] outline-none transition-all px-5 py-3"
              placeholder="e.g. Maruti Suzuki Swift Desire"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
              Charges per Day (₹)
            </label>
            <input
              type="number"
              name="charges"
              value={formData.charges}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/[0.08] outline-none transition-all px-5 py-3"
              placeholder="1000"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/[0.08] outline-none transition-all px-5 py-3 min-h-[80px]"
              placeholder="Any special features, condition, etc."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
              Car Picture
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 text-slate-400 text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/[0.08] outline-none transition-all px-5 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
          >
            {loading ? 'Saving...' : 'Save Car Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverCarDetails;

