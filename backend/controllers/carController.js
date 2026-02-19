const Car = require('../models/Car');

// Add a new car
exports.addCar = async (req, res) => {
  try {
    const { carName, model, price, passengers, fuelType, transmission, image, location } = req.body;
    
    const newCar = new Car({
      driverId: req.user.id,  // User ID from authenticated request
      carName,
      model,
      price,
      passengers,
      fuelType,
      transmission,
      image,
      location,
      isAvailable: true
    });

    const car = await newCar.save();
    res.status(201).json({ success: true, car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available cars (for customers)
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true }).populate('driverId', 'name contact');
    res.status(200).json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get driver's cars
exports.getDriverCars = async (req, res) => {
  try {
    const cars = await Car.find({ driverId: req.user.id });
    res.status(200).json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update car details
exports.updateCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const { carName, model, price, passengers, fuelType, transmission, image, location, isAvailable } = req.body;

    const car = await Car.findByIdAndUpdate(
      carId,
      { carName, model, price, passengers, fuelType, transmission, image, location, isAvailable },
      { new: true }
    );

    res.status(200).json({ success: true, car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete car
exports.deleteCar = async (req, res) => {
  try {
    const { carId } = req.params;
    await Car.findByIdAndDelete(carId);
    res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};