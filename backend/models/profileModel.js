const db = require('../utils/db');

async function createProfile(user_id, role, skills, interests, bio) {
  const query = `
    INSERT INTO profiles (user_id, role, skills, interests, bio)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [user_id, role, skills, interests, bio];
  const result = await db.query(query, values);
  return result.rows[0];
}

async function getProfileByUserId(user_id) {
  const query = `SELECT * FROM profiles WHERE user_id = $1;`;
  const result = await db.query(query, [user_id]);
  return result.rows[0];
}

async function updateProfile(profileId, role, skills, interests, bio) {
  const query = `
    UPDATE profiles
    SET role = $1,
        skills = $2,
        interests = $3,
        bio = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *;
  `;
  const values = [role, skills, interests, bio, profileId];
  const result = await db.query(query, values);
  return result.rows[0];
}

async function getAllProfiles(filters = {}) {
  let query = `SELECT p.*, u.username, u.email FROM profiles p JOIN users u ON p.user_id = u.id`;
  const whereClauses = [];
  const values = [];
  let count = 1;

  if(filters.role) {
    whereClauses.push(`role = $${count++}`);
    values.push(filters.role);
  }
  if(filters.skills) {
    whereClauses.push(`skills ILIKE $${count++}`);
    values.push(`%${filters.skills}%`);
  }
  if(filters.interests) {
    whereClauses.push(`interests ILIKE $${count++}`);
    values.push(`%${filters.interests}%`);
  }
  if(whereClauses.length) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  query += ' ORDER BY p.updated_at DESC';

  const result = await db.query(query, values);
  return result.rows;
}
async function deleteProfile(profileId) {
  const query = `
    DELETE FROM profiles
    WHERE id = $1
  `;
  await db.query(query, [profileId]);
}

module.exports = {
  createProfile,
  getProfileByUserId,
  updateProfile,
  getAllProfiles,
  deleteProfile,
};
