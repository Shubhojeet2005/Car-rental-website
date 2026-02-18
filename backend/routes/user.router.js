import express from 'express';
const router = express.Router();
import userModel from '../models/user.js';
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
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
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

router.post('/register_driver',[
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('phone').notEmpty().withMessage('Lisence number is required'),
    body('car_name').notEmpty().withMessage('Car name is required'),
    body('Car_license_no').notEmpty().withMessage('Lisence number is required'),
    body('doc_upload').notEmpty().withMessage('Document uploading is mandatory'),
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {firstname,lastname,phone,car_license_no,car_name,doc_upload,password}=req.body;
    try{
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }
        const hashpassword = await bcrypt.hash(password,10);

        const newUser= await userModel.create({
            firstname,
            lastname,
            phone,
            password:hashpassword,
            car_name,
            car_license_no,
            doc_upload

        });
        res.status(201).json({message:'User registered successfully',user:newUser});
    }catch(error){
        console.error('Error registering user:',error);
        res.status(500).json({message:'Server error'});
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