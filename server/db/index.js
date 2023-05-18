//import the pool object from the pg library (node-postgres)
const { Pool } = require('pg');

// Create e new pool, this is the part ahat actually connects to our postgres database
// The username and password etc to connect to postgres circulate db is stored in the .env file so we don't have to put theminside the pool object
const pool = new Pool();

// export the query object so that we can use it in other files to query the database
module.exports = {
  query: (text, params) => pool.query(text, params),
}