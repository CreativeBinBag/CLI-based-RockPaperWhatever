const dotenv =  require('dotenv').config();
//setting up database with ORM (Sequelize)

const {Sequelize, DataTypes} = require('sequelize') //importing Sequelize and DataTypes classes from sequelize package

const DATABASE_URL = process.env.DATABASE_URL 

//create a new Sequelize object to access all the properties and methods of the Sequelize class and create a connection with the postgres database
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Ensure SSL is required
      rejectUnauthorized: false, // Set to true if you want to enforce strict SSL verification
    },
  },
});


//checking if connection is done
sequelize.authenticate().then(() => {
  console.log(`Database connected`)
}).catch((err) => {
  console.log(err)
})


//initialize an empty object
const db = {}


db.Sequelize = Sequelize //gives access to the Sequelize class, which includes data types and other static properties/methods.

db.sequelize = sequelize // is the instance that connects to postgres database, and we use it to perform actions like defining models, syncing them with the database, and running queries.

db.User = require('./Models/userModel')(sequelize, DataTypes);

module.exports = db