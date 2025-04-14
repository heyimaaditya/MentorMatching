const mentorshipModel = require('../models/mentorshipModel');

async function createRequest(req, res) {
  try {
    const mentee_id = req.user.id; // Authenticated user is the mentee
    const { mentor_id } = req.body;

    if (!mentor_id) {
      return res.status(400).json({ message: 'mentor_id is required.' });
    }
    if (mentor_id === mentee_id) {
      return res.status(400).json({ message: 'You cannot send a request to yourself.' });
    }

    const request = await mentorshipModel.createMentorshipRequest(mentor_id, mentee_id);
    return res.status(201).json({ message: 'Mentorship request sent.', request });
  } catch (error) {
    console.error('Create mentorship request error:', error);
    return res.status(500).json({ message: error.message || 'Could not create mentorship request.' });
  }
}

async function updateRequest(req, res) {
  try {
    const { requestId } = req.params;  // from URL param
    const { status } = req.body;       // "accepted" or "declined"

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or declined.' });
    }

    const updated = await mentorshipModel.updateMentorshipRequest(requestId, status);
    if (!updated) {
      return res.status(404).json({ message: 'Mentorship request not found.' });
    }

    return res.status(200).json({ message: 'Mentorship request updated.', request: updated });
  } catch (error) {
    console.error('Update mentorship request error:', error);
    return res.status(500).json({ message: 'Could not update mentorship request.' });
  }
}

async function getRequests(req, res) {
  try {
    const userId = req.user.id;
    const requests = await mentorshipModel.getMentorshipRequestsForUser(userId);
    return res.status(200).json({ requests });
  } catch (error) {
    console.error('Get mentorship requests error:', error);
    return res.status(500).json({ message: 'Could not get mentorship requests.' });
  }
}

module.exports = {
  createRequest,
  updateRequest,
  getRequests,
};
