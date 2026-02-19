import React, { useState } from 'react';
import axios from 'axios';
import './DriverCarPage.css';

const API_URL = 'http://localhost:3000';

const DriverCarPage = () => {
  const [carData, setCarData] = useState({
    carName: '',
    model: '',
    price: '',
    passengers: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    image: null,
    location: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setCarData({ ...carData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (!carData.image) {
        setMessage('Please upload a car image');
        return;
      }

      // Map legacy UI fields -> backend drivercars fields
      const descriptionParts = [
        carData.model ? `Model: ${carData.model}` : '',
        carData.passengers ? `Passengers: ${carData.passengers}` : '',
        carData.fuelType ? `Fuel: ${carData.fuelType}` : '',
        carData.transmission ? `Transmission: ${carData.transmission}` : '',
        carData.location ? `Location: ${carData.location}` : '',
      ].filter(Boolean);

      const form = new FormData();
      form.append('name', carData.carName);
      form.append('charges', carData.price);
      form.append('description', descriptionParts.join(' • '));
      form.append('image', carData.image);

      await axios.post(`${API_URL}/user/drivercars`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Car added successfully!');
      setCarData({
        carName: '',
        model: '',
        price: '',
        passengers: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        image: null,
        location: ''
      });
    } catch (error) {
      const apiMsg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        error.message;
      setMessage('Error adding car: ' + apiMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="driver-car-page">
      <div className="form-container">
        <h2>Add Your Car for Rental</h2>
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Car Name:</label>
            <input
              type="text"
              name="carName"
              value={carData.carName}
              onChange={handleInputChange}
              placeholder="e.g., Toyota Fortuner"
              required
            />
          </div>

          <div className="form-group">
            <label>Model:</label>
            <input
              type="text"
              name="model"
              value={carData.model}
              onChange={handleInputChange}
              placeholder="e.g., 2020"
              required
            />
          </div>

          <div className="form-group">
            <label>Daily Price (₹):</label>
            <input
              type="number"
              name="price"
              value={carData.price}
              onChange={handleInputChange}
              placeholder="e.g., 5000"
              required
            />
          </div>

          <div className="form-group">
            <label>Number of Passengers:</label>
            <input
              type="number"
              name="passengers"
              value={carData.passengers}
              onChange={handleInputChange}
              placeholder="e.g., 5"
              required
            />
          </div>

          <div className="form-group">
            <label>Fuel Type:</label>
            <select name="fuelType" value={carData.fuelType} onChange={handleInputChange}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Transmission:</label>
            <select name="transmission" value={carData.transmission} onChange={handleInputChange}>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          <div className="form-group">
            <label>Car Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {carData.image && (
              <img
                src={URL.createObjectURL(carData.image)}
                alt="Car preview"
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Location/City:</label>
            <input
              type="text"
              name="location"
              value={carData.location}
              onChange={handleInputChange}
              placeholder="e.g., Delhi, Bangalore"
              required
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding Car...' : 'Add Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverCarPage;