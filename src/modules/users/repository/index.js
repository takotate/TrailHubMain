/* eslint-disable */
// This file handles database operations for users - saving/loading user data
// Owned tables: users, user_profiles, user_roles
const { getPool } = require('../../../shared/db');

/**
 * Get a user's information from the database
 * @param {string} id - user ID to look up
 * @returns {Promise<Object>} user data
 */
function getUserById(id) {
  void id; void getPool; // TODO: replace with real database query
  return Promise.resolve({ id, email: null, role: 'hiker' });
}

module.exports = { getUserById };
