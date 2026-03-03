import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAbout.css';

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState({
    companyName: '',
    tagline: '',
    description: '',
    missionStatement: '',
    visionStatement: '',
    yearEstablished: new Date().getFullYear(),
    foundedBy: '',
    totalCars: 0,
    totalCustomers: 0,
    totalTrips: 0,
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get('/api/about/get');
      if (response.data.success) {
        setAboutData(response.data.data);
      }
    } catch (error) {
      showMessage('Failed to load about data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('social')) {
      const socialKey = name.split('.')[1];
      setAboutData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setAboutData(prev => ({
        ...prev,
        [name]: isNaN(value) ? value : Number(value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put('/api/about/update', aboutData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showMessage('About page updated successfully!', 'success');
        setAboutData(response.data.data);
      }
    } catch (error) {
      showMessage('Failed to update about page: ' + error.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-about-container container section">
      <div className="admin-header">
        <h1>Manage About Page</h1>
        <p>Edit company information, mission, vision, and contact details</p>
      </div>

      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General Info
        </button>
        <button
          className={`tab-button ${activeTab === 'mission' ? 'active' : ''}`}
          onClick={() => setActiveTab('mission')}
        >
          Mission & Vision
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact & Social
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* General Info Tab */}
        {activeTab === 'general' && (
          <div className="form-section">
            <h2>General Information</h2>
            
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={aboutData.companyName}
                onChange={handleInputChange}
                placeholder="Company name"
                required
              />
            </div>

            <div className="form-group">
              <label>Tagline *</label>
              <input
                type="text"
                name="tagline"
                value={aboutData.tagline}
                onChange={handleInputChange}
                placeholder="Company tagline"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={aboutData.description}
                onChange={handleInputChange}
                placeholder="Company description"
                rows="6"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year Established *</label>
                <input
                  type="number"
                  name="yearEstablished"
                  value={aboutData.yearEstablished}
                  onChange={handleInputChange}
                  placeholder="2020"
                  required
                />
              </div>

              <div className="form-group">
                <label>Founded By *</label>
                <input
                  type="text"
                  name="foundedBy"
                  value={aboutData.foundedBy}
                  onChange={handleInputChange}
                  placeholder="Founder name"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Mission & Vision Tab */}
        {activeTab === 'mission' && (
          <div className="form-section">
            <h2>Mission & Vision</h2>
            
            <div className="form-group">
              <label>Mission Statement *</label>
              <textarea
                name="missionStatement"
                value={aboutData.missionStatement}
                onChange={handleInputChange}
                placeholder="Our mission is..."
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label>Vision Statement *</label>
              <textarea
                name="visionStatement"
                value={aboutData.visionStatement}
                onChange={handleInputChange}
                placeholder="Our vision is..."
                rows="5"
                required
              />
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="form-section">
            <h2>Key Statistics</h2>
            <p className="section-hint">These numbers are displayed on the about page</p>
            
            <div className="form-row">
              <div className="form-group">
                <label>Total Cars in Fleet</label>
                <input
                  type="number"
                  name="totalCars"
                  value={aboutData.totalCars}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Total Happy Customers</label>
                <input
                  type="number"
                  name="totalCustomers"
                  value={aboutData.totalCustomers}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Total Successful Trips</label>
                <input
                  type="number"
                  name="totalTrips"
                  value={aboutData.totalTrips}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact & Social Tab */}
        {activeTab === 'contact' && (
          <div className="form-section">
            <h2>Contact & Social Links</h2>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="contactEmail"
                value={aboutData.contactEmail}
                onChange={handleInputChange}
                placeholder="info@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="contactPhone"
                value={aboutData.contactPhone}
                onChange={handleInputChange}
                placeholder="+91-9876543210"
                required
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={aboutData.address}
                onChange={handleInputChange}
                placeholder="City, Country"
                required
              />
            </div>

            <h3>Social Media Links</h3>

            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                name="social.facebook"
                value={aboutData.socialLinks.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="form-group">
              <label>Twitter URL</label>
              <input
                type="url"
                name="social.twitter"
                value={aboutData.socialLinks.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/..."
              />
            </div>

            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                name="social.instagram"
                value={aboutData.socialLinks.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                type="url"
                name="social.linkedin"
                value={aboutData.socialLinks.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/..."
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAbout;