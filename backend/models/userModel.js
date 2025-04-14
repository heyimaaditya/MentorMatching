const db = require('../utils/db');

async function createUser(username, email, hashedPassword) {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [username, email, hashedPassword];
  const result = await db.query(query, values);
  return result.rows[0];
}

async function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await db.query(query, [email]);
  return result.rows[0];
}

async function getUserById(id) {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
