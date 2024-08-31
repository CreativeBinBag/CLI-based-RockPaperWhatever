
const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const db = require ('./index')
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('.');
const userRoutes = require('./Routes/userRoute')


//setting up your port
const PORT = process.env.PORT || 10000

//assigning the variable app to express
const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Use environment variable for client URL
  credentials: true
}));

//middleware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())


db.sequelize.sync().then(() => {
  console.log("db synced")
});

app.use('/api/users', userRoutes);

//listening to server connection
app.listen(PORT,'0.0.0.0', () => console.log(`Server is connected on ${PORT}`))