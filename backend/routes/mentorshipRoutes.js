const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  createRequest,
  updateRequest,
  getRequests,
} = require('../controllers/mentorshipController');

const router = express.Router();

// POST /api/mentorship => create a mentorship request
router.post('/', authenticateToken, createRequest);

// PUT /api/mentorship/:requestId => accept or decline a request
router.put('/:requestId', authenticateToken, updateRequest);

// GET /api/mentorship => get all requests for the logged-in user
router.get('/', authenticateToken, getRequests);

module.exports = router;
