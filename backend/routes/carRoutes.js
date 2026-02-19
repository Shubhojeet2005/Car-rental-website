const express = require('express');
const router = express.Router();
const { addCar, getAllCars, getDriverCars, updateCar, deleteCar } = require('../controllers/carController');
const auth = require('../middleware/auth');  // Authentication middleware

router.post('/add', auth, addCar);
router.get('/all', getAllCars);
router.get('/my-cars', auth, getDriverCars);
router.put('/update/:carId', auth, updateCar);
router.delete('/delete/:carId', auth, deleteCar);

module.exports = router;