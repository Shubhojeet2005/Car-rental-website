import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    driver_license_no: '',
    password: '',
    doc_upload: null,
    picture: null,
  });
  const [carForm, setCarForm] = useState({
    name: '',
    charges: '',
    description: '',
    image: null,
    driver: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('drivers');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/admin/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        navigate('/');
        return;
      }
      setUser(parsed);
    } catch (_) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/drivers`);
        const data = await res.json();
        if (res.ok && data.drivers) setDrivers(data.drivers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, [user]);

  const handleDriverChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] : value,
    }));
  };

  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== '') form.append(k, v);
    });
    try {
      const res = await fetch(`${API_URL}/admin/drivers`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setMessage({ type: 'success', text: data.message });
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        driver_license_no: '',
        password: '',
        doc_upload: null,
        picture: null,
      });
      const listRes = await fetch(`${API_URL}/admin/drivers`);
      const listData = await listRes.json();
      if (listRes.ok && listData.drivers) setDrivers(listData.drivers);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleCarChange = (e) => {
    const { name, value, type, files } = e.target;
    setCarForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] : value,
    }));
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const form = new FormData();
    form.append('name', carForm.name);
    form.append('charges', carForm.charges);
    form.append('description', carForm.description);
    if (carForm.driver) form.append('driver', carForm.driver);
    if (carForm.image) form.append('image', carForm.image);
    try {
      const res = await fetch(`${API_URL}/admin/cars`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setMessage({ type: 'success', text: data.message });
      setCarForm({ name: '', charges: '', description: '', image: null, driver: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogout'));
    navigate('/admin/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'drivers' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Create Driver
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'cars' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Create Car
          </button>
        </div>

        {activeTab === 'drivers' && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Create New Driver</h2>
            <p className="text-slate-400 text-sm mb-4">Drivers created here will appear in the customer booking dropdown.</p>
            <form onSubmit={handleDriverSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleDriverChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleDriverChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleDriverChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleDriverChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Driver License No *</label>
                  <input
                    type="text"
                    name="driver_license_no"
                    value={formData.driver_license_no}
                    onChange={handleDriverChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleDriverChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Document (optional)</label>
                  <input
                    type="file"
                    name="doc_upload"
                    onChange={handleDriverChange}
                    accept=".pdf,.doc,.docx,image/*"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Picture (optional)</label>
                  <input
                    type="file"
                    name="picture"
                    onChange={handleDriverChange}
                    accept="image/*"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-lg"
              >
                Create Driver
              </button>
            </form>
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Create New Car</h2>
            <form onSubmit={handleCarSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Car Name *</label>
                <input
                  type="text"
                  name="name"
                  value={carForm.name}
                  onChange={handleCarChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Charges (₹/day) *</label>
                  <input
                    type="number"
                    name="charges"
                    value={carForm.charges}
                    onChange={handleCarChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Assign Driver (optional)</label>
                  <select
                    name="driver"
                    value={carForm.driver}
                    onChange={handleCarChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">-- None --</option>
                    {drivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.firstname} {d.lastname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  value={carForm.description}
                  onChange={handleCarChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Car Image *</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleCarChange}
                  accept="image/*"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-lg"
              >
                Create Car
              </button>
            </form>
          </div>
        )}

        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Existing Drivers ({drivers.length})</h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : drivers.length === 0 ? (
            <p className="text-slate-500">No drivers yet. Create one above.</p>
          ) : (
            <div className="space-y-2">
              {drivers.map((d) => (
                <div
                  key={d._id}
                  className="flex justify-between items-center bg-slate-800/50 rounded-lg px-4 py-3"
                >
                  <span className="text-white">
                    {d.firstname} {d.lastname} - {d.email}
                  </span>
                  <span className="text-slate-400 text-sm">{d.phone}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
