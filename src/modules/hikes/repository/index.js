/* eslint-disable */
// Owned tables: hikes, hike_media, routes

/** TODO: Replace with real DB list query. */
function listHikes() { return Promise.resolve([{ id: 'h1', name: 'Stub Hike' }]); }

/** TODO: Replace with real DB get query. */
function getHikeById(id) { void id; return Promise.resolve({ id, name: 'Stub Hike' }); }

module.exports = { listHikes, getHikeById };
