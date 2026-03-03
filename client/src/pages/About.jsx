import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './About.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/about/get');
      if (response.data.success) {
        setAboutData(response.data.data);
      }
    } catch (err) {
      setError('Failed to load about information');
      console.error('Error fetching about data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!aboutData) {
    return <div className="error">No about information found</div>;
  }

  return (
    <div className="about-container container section">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>{aboutData.companyName}</h1>
          <p className="tagline">{aboutData.tagline}</p>
        </div>
      </section>


      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="section-container">
          <div className="mission-vision-grid">
            <div className="mission-card card">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>{aboutData.missionStatement}</p>
            </div>
            <div className="vision-card card">
              <div className="card-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>{aboutData.visionStatement}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <h2>Our Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{aboutData.totalCars}+</h3>
              <p>Vehicles in Fleet</p>
            </div>
            <div className="stat-card">
              <h3>{aboutData.totalCustomers}+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-card">
              <h3>{aboutData.totalTrips}+</h3>
              <p>Successful Trips</p>
            </div>
            <div className="stat-card">
              <h3>24/7</h3>
              <p>Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {aboutData.features && aboutData.features.length > 0 && (
        <section className="features-section">
          <div className="section-container">
            <h2>Why Choose Us?</h2>
            <div className="features-grid">
              {aboutData.features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {aboutData.team && aboutData.team.length > 0 && (
        <section className="team-section">
          <div className="section-container">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              {aboutData.team.map((member, index) => (
                <div key={index} className="team-card">
                  <img src={member.image} alt={member.name} className="team-image" />
                  <h3>{member.name}</h3>
                  <p className="position">{member.position}</p>
                  <p className="bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact & Location Section */}
      <section className="contact-section">
        <div className="section-container">
          <h2>Get In Touch</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <FaMapMarkerAlt className="contact-icon" />
              <h3>Location</h3>
              <p>{aboutData.address}</p>
            </div>
            <div className="contact-card">
              <FaPhone className="contact-icon" />
              <h3>Phone</h3>
              <a href={`tel:${aboutData.contactPhone}`}>{aboutData.contactPhone}</a>
            </div>
            <div className="contact-card">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <a href={`mailto:${aboutData.contactEmail}`}>{aboutData.contactEmail}</a>
            </div>
          </div>

          {/* Social Links */}
          {aboutData.socialLinks && (
            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                {aboutData.socialLinks.facebook && (
                  <a href={aboutData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                  </a>
                )}
                {aboutData.socialLinks.twitter && (
                  <a href={aboutData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                )}
                {aboutData.socialLinks.instagram && (
                  <a href={aboutData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                )}
                {aboutData.socialLinks.linkedin && (
                  <a href={aboutData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;