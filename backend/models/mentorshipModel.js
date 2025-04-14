const db = require('../utils/db');

// Create a new mentorship request
async function createMentorshipRequest(mentor_id, mentee_id) {
  // Prevent duplicate pending requests
  const checkQuery = `
    SELECT * FROM mentorship_requests
    WHERE mentor_id = $1 AND mentee_id = $2 AND status = 'pending';
  `;
  const checkResult = await db.query(checkQuery, [mentor_id, mentee_id]);
  if (checkResult.rows.length > 0) {
    throw new Error('A pending mentorship request already exists for this pair.');
  }

  const insertQuery = `
    INSERT INTO mentorship_requests (mentor_id, mentee_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await db.query(insertQuery, [mentor_id, mentee_id]);
  return result.rows[0];
}

// Update the request status
async function updateMentorshipRequest(requestId, status) {
  const query = `
    UPDATE mentorship_requests
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [status, requestId]);
  return result.rows[0];
}

// Get all mentorship requests for a user 
async function getMentorshipRequestsForUser(userId) {
  const query = `
    SELECT mr.*, 
           u.username AS mentor_name,
           u2.username AS mentee_name
    FROM mentorship_requests mr
    LEFT JOIN users u ON mr.mentor_id = u.id
    LEFT JOIN users u2 ON mr.mentee_id = u2.id
    WHERE mentor_id = $1 OR mentee_id = $1
    ORDER BY mr.created_at DESC;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
}

module.exports = {
  createMentorshipRequest,
  updateMentorshipRequest,
  getMentorshipRequestsForUser,
};
