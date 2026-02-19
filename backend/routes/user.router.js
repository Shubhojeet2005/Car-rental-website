import express from 'express';
const router = express.Router();
import userModel from '../models/user.js';
import driverModel from '../models/driver.js';
import driverCarModel from '../models/driverCar.js';
import formModel from '../models/form.js';
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

router.post(
  '/register_driver',
  upload.fields([
    { name: 'doc_upload', maxCount: 1 },
    { name: 'car_picture', maxCount: 1 },
  ]),
  [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('car_name').notEmpty().withMessage('Car name is required'),
    body('car_license_no').notEmpty().withMessage('License number is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, phone, car_name, car_license_no, password } = req.body;

    const docFile = req.files?.doc_upload?.[0];
    const carPicFile = req.files?.car_picture?.[0];

    if (!docFile || !carPicFile) {
      return res.status(400).json({ message: 'Car picture and document are required' });
    }

    try {
      const existingDriver = await driverModel.findOne({ email });
      if (existingDriver) {
        return res.status(400).json({ message: 'Driver already exists' });
      }
      const hashpassword = await bcrypt.hash(password, 10);

      const newDriver = await driverModel.create({
        firstname,
        lastname,
        email,
        phone,
        car_name,
        car_license_no,
        password: hashpassword,
        doc_upload: `/uploads/${docFile.filename}`,
        car_picture: `/uploads/${carPicFile.filename}`,
      });
      res.status(201).json({ message: 'Driver registered successfully', user: newDriver });
    } catch (error) {
      console.error('Error registering driver:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Create a car listing by driver
router.post(
  '/drivercars',
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Car name is required'),
    body('charges')
      .notEmpty()
      .withMessage('Charges are required')
      .isNumeric()
      .withMessage('Charges must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Car image is required' });
    }

    const { name, charges, description = '' } = req.body;

    try {
      const car = await driverCarModel.create({
        name,
        charges: Number(charges),
        description,
        image: `/uploads/${req.file.filename}`,
      });
      res.status(201).json({ message: 'Car created successfully', car });
    } catch (error) {
      console.error('Error creating driver car:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all driver cars
router.get('/drivercars', async (req, res) => {
  try {
    const cars = await driverCarModel.find().sort({ createdAt: -1 });
    res.status(200).json({ cars });
  } catch (error) {
    console.error('Error fetching driver cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single driver car
router.get('/drivercars/:id', async (req, res) => {
  try {
    const car = await driverCarModel.findById(req.params.id);
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
                profilePicture: user.profilePicture || ''
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

// Book a car
router.post('/book', async (req, res) => {
    const { carName, email, passenger, date, time, days, hours, minutes, seconds, milliseconds, totalAmount, itinerary } = req.body;
    try {
        const places = Array.isArray(itinerary) ? itinerary : [];
        const [place1 = '', place2 = '', place3 = '', place4 = '', place5 = '', place6 = ''] = places;
        const payload = {
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
        res.status(201).json({ message: 'Car booked successfully', form: newForm });
    } catch (error) {
        console.error('Error booking car:', error);
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