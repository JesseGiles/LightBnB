const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  
  const userQuery = 'Select * FROM users WHERE email = $1';
  const values = [email];
    
    return pool.query(userQuery, values)
      .then((user) => {
        return (user.rows[0]);
      })
      .catch((err) => {
        console.log(err.message);
      })
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  const userIDQuery = 'Select * FROM users WHERE id = $1;';
  const values = [id];

  return pool.query(userIDQuery, values)
  .then((user) => {
    return (user.rows[0]);
  })
  .catch((err) => {
    console.log(err.message);
  })
  // return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;

  const insertNewUser = `INSERT INTO users (
    name, email, password) 
    VALUES ($1, $3, $2) RETURNING *;`;
    const values = [user.name, user.password, user.email]

  return pool.query(insertNewUser, values)
    .then((user) => {
      return (user.rows[0]);
    })
    .catch((err) => {
      console.log(err.message);
    })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const reservationsQuery = `
  SELECT reservations.*, properties.*, reservations.start_date, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;
  const values = [guest_id, limit];

  return pool.query(reservationsQuery, values)
  .then((reservations) => {
    return (reservations.rows);
  })
  .catch((err) => {
    console.log(err.message);
  })

  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {

  const sqlString = `SELECT * FROM properties LIMIT $1;`;

  return pool.query(sqlString, [limit])
    .then((result) => {
      return (result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
