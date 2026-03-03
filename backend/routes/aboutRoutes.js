import express from 'express';
import {
  getAbout,
  updateAbout,
  addTeamMember,
  removeTeamMember,
  addFeature
} from '../controllers/aboutController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/get', getAbout);

// Admin only routes
router.put('/update', auth, adminAuth, updateAbout);
router.post('/team/add', auth, adminAuth, addTeamMember);
router.delete('/team/remove/:memberId', auth, adminAuth, removeTeamMember);
router.post('/feature/add', auth, adminAuth, addFeature);

export default router;