const express = require('express');
const { createProfile, updateProfile, getAllProfiles, getMyProfile,deleteProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { validateBody } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/', authenticateToken, validateBody(['role']), createProfile);
router.put('/', authenticateToken, updateProfile);
router.get('/', authenticateToken, getAllProfiles);
router.get('/me', authenticateToken, getMyProfile); 


router.delete('/', authenticateToken, deleteProfile);

module.exports = router;
