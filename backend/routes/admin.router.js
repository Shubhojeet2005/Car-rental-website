import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import AdminUser from '../models/AdminUser.js';
import {
  adminLogin,
  createDriver,
  listDriversAdmin,
  createCar,
} from '../controllers/adminController.js';

const router = express.Router();

// One-time admin registration (call once to create first admin)
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, name } = req.body;
    try {
      const existing = await AdminUser.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Admin already exists' });
      }
      const hash = await bcrypt.hash(password, 10);
      const admin = await AdminUser.create({ email, password: hash, name: name || 'Admin' });
      res.status(201).json({ message: 'Admin registered', admin: { id: admin._id, email: admin.email } });
    } catch (error) {
      console.error('Admin register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email required'),
    body('password').trim().notEmpty().withMessage('Password required'),
  ],
  adminLogin
);

router.post('/drivers', createDriver);
router.get('/drivers', listDriversAdmin);
router.post('/cars', createCar);

export default router;
