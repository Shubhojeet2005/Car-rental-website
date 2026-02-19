import express from 'express';
const router = express.Router();
import userModel from '../models/user.js';
import driverModel from '../models/driver.js';
import driverCarModel from '../models/driverCar.js';
import formModel from '../models/form.js';
import TripNotification from '../models/TripNotification.js';
import bcrypt from 'bcrypt';
import {body,validationResult} from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Allow common image types including webp
        const imageTypes = /jpeg|jpg|png|gif|webp/;
        // Allow documents plus images for driver docs
        const docTypes = /pdf|doc|docx|jpeg|jpg|png|gif|webp/;
        const ext = path.extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype.toLowerCase();

        if (file.fieldname === 'doc_upload') {
            if (docTypes.test(ext) || docTypes.test(mimetype)) {
                return cb(null, true);
            }
            return cb(new Error('Only document or image files are allowed for documents'));
        }

        if (imageTypes.test(ext) && imageTypes.test(mimetype)) {
            return cb(null, true);
        }
        return cb(new Error('Only image files are allowed!'));
    }
});

router.post('/register',[
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {firstname,lastname,email,password}=req.body;
    try{
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }
        const hashpassword = await bcrypt.hash(password,10);

        const newUser= await userModel.create({
            firstname,
            lastname,
            email,
            password:hashpassword
        });
        res.status(201).json({message:'User registered successfully',user:newUser});
    }catch(error){
        console.error('Error registering user:',error);
        res.status(500).json({message:'Server error'});
    }
});

// Get all drivers (admin-created, for customer to select)
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await driverModel.find({ isActive: true }).select('-password').sort({ firstname: 1 });
    res.status(200).json({ drivers });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all driver cars (populate driver if assigned)
router.get('/drivercars', async (req, res) => {
  try {
    const cars = await driverCarModel.find().populate('driver', 'firstname lastname email phone').sort({ createdAt: -1 });
    res.status(200).json({ cars });
  } catch (error) {
    console.error('Error fetching driver cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single driver car (populate driver)
router.get('/drivercars/:id', async (req, res) => {
  try {
    const car = await driverCarModel.findById(req.params.id).populate('driver', 'firstname lastname email phone');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ car });
  } catch (error) {
    console.error('Error fetching driver car:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login',[
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').trim().notEmpty().withMessage('Password is required')
], async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: 'Invalid data'
        });
    }

    const {email,password}=req.body;
    try {
        const user=await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        res.status(200).json({
            message: "Login successful",
            user: { 
                id: user._id, 
                email: user.email, 
                firstname: user.firstname, 
                lastname: user.lastname,
                profilePicture: user.profilePicture || '',
                role: 'customer'
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post(
  '/driverlogin',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data',
      });
    }

    const { email, password } = req.body;
    try {
      const driver = await driverModel.findOne({ email });
      if (!driver) {
        return res.status(400).json({ message: 'Driver not found' });
      }
      const isMatch = await bcrypt.compare(password, driver.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: driver._id,
          email: driver.email,
          phone: driver.phone,
          firstname: driver.firstname,
          lastname: driver.lastname,
          role: 'driver',
        },
      });
    } catch (error) {
      console.error('Error during driver login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user profile
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Book a car (customer selects driver - driver receives notification)
router.post('/book', async (req, res) => {
    const { driverId, carName, email, passenger, date, time, days, hours, minutes, seconds, milliseconds, totalAmount, itinerary } = req.body;
    if (!driverId) {
        return res.status(400).json({ message: 'Please select a driver' });
    }
    try {
        const driver = await driverModel.findById(driverId);
        if (!driver || !driver.isActive) {
            return res.status(400).json({ message: 'Invalid or inactive driver' });
        }
        const places = Array.isArray(itinerary) ? itinerary : [];
        const [place1 = '', place2 = '', place3 = '', place4 = '', place5 = '', place6 = ''] = places;
        const payload = {
            driverId,
            carName: carName || '',
            email: email || '',
            passenger: passenger ?? '',
            date: date || new Date(),
            time: time || '',
            days: Number(days) || 0,
            hours: Number(hours) || 0,
            minutes: Number(minutes) || 0,
            seconds: Number(seconds) || 0,
            milliseconds: Number(milliseconds) || 0,
            totalAmount: Number(totalAmount) || 0,
            place1, place2, place3, place4, place5, place6
        };
        const newForm = await formModel.create(payload);
        // Create trip notification for driver
        await TripNotification.create({
            driverId,
            tripId: newForm._id,
            message: `New trip booked: ${carName || 'Car'} - Pickup: ${date} at ${time}. Customer: ${email}`,
            customerEmail: email,
            carName: carName || '',
            pickupDate: payload.date,
            pickupTime: time || '',
        });
        res.status(201).json({ message: 'Car booked successfully. Driver has been notified.', form: newForm });
    } catch (error) {
        console.error('Error booking car:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get driver's trip notifications
router.get('/driver/notifications/:driverId', async (req, res) => {
    try {
        const notifications = await TripNotification.find({ driverId: req.params.driverId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark notification as read
router.put('/driver/notifications/:id/read', async (req, res) => {
    try {
        await TripNotification.findByIdAndUpdate(req.params.id, { read: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update profile picture
router.put('/profile/:id/picture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await userModel.findById(req.params.id);
        if (!user) {
            // Delete uploaded file if user not found
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile picture if exists
        if (user.profilePicture) {
            const oldPicturePath = path.join(__dirname, '../uploads', path.basename(user.profilePicture));
            if (fs.existsSync(oldPicturePath)) {
                fs.unlinkSync(oldPicturePath);
            }
        }

        // Update user with new profile picture path
        const profilePictureUrl = `/uploads/${req.file.filename}`;
        user.profilePicture = profilePictureUrl;
        await user.save();

        res.status(200).json({
            message: 'Profile picture updated successfully',
            profilePicture: profilePictureUrl,
            user: {
                id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;