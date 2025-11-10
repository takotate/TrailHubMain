/* eslint-disable */
// src/adapters/firebase.auth.js
// Stub for development. Replace with real firebase-admin later.

async function verifyIdToken(token) {
  // In production, you'd verify the Firebase token here.
  // In dev mode we just return null so auth.middleware falls back to x-dev-user header.
  if (!token) return null;
  return null;
}

module.exports = { verifyIdToken };

