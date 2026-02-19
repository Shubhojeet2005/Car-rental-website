import bcrypt from 'bcrypt';
import driverModel from '../models/driver.js';
import driverCarModel from '../models/driverCar.js';
import AdminUser from '../models/AdminUser.js';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'driver-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif|webp/;
    const docTypes = /pdf|doc|docx|jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype.toLowerCase();
    if (file.fieldname === 'doc_upload') {
      if (docTypes.test(ext) || docTypes.test(mimetype)) return cb(null, true);
      return cb(new Error('Only document or image files allowed'));
    }
    if (imageTypes.test(ext) && imageTypes.test(mimetype)) return cb(null, true);
    return cb(new Error('Only image files allowed!'));
  },
});

// Admin login
export const adminLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    res.status(200).json({
      message: 'Admin login successful',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create driver (admin only)
export const createDriver = [
  upload.fields([
    { name: 'doc_upload', maxCount: 1 },
    { name: 'picture', maxCount: 1 },
  ]),
  [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('driver_license_no').notEmpty().withMessage('Driver license number is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstname, lastname, email, phone, driver_license_no, password } = req.body;
    const docFile = req.files?.doc_upload?.[0];
    const picFile = req.files?.picture?.[0];

    try {
      const existingDriver = await driverModel.findOne({ email });
      if (existingDriver) {
        return res.status(400).json({ message: 'Driver with this email already exists' });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newDriver = await driverModel.create({
        firstname,
        lastname,
        email,
        phone,
        driver_license_no,
        password: hashPassword,
        doc_upload: docFile ? `/uploads/${docFile.filename}` : '',
        picture: picFile ? `/uploads/${picFile.filename}` : '',
        createdByAdmin: true,
        isActive: true,
      });
      res.status(201).json({
        message: 'Driver created successfully',
        driver: {
          id: newDriver._id,
          firstname: newDriver.firstname,
          lastname: newDriver.lastname,
          email: newDriver.email,
          phone: newDriver.phone,
        },
      });
    } catch (error) {
      console.error('Error creating driver:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
];

// List all drivers (admin)
export const listDriversAdmin = async (req, res) => {
  try {
    const drivers = await driverModel.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ drivers });
  } catch (error) {
    console.error('Error listing drivers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create car (admin only)
export const createCar = [
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Car name is required'),
    body('charges').notEmpty().withMessage('Charges required').isNumeric().withMessage('Charges must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Car image is required' });
    }
    const { name, charges, description = '', driver } = req.body;
    try {
      const car = await driverCarModel.create({
        name,
        charges: Number(charges),
        description,
        image: `/uploads/${req.file.filename}`,
        driver: driver || null,
      });
      res.status(201).json({ message: 'Car created successfully', car });
    } catch (error) {
      console.error('Error creating car:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
];
