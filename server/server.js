const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const db = require ('./index')
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('.');
const userRoutes = require('./Routes/userRoute')
const { spawn } = require('child_process'); // Import for spawning child processes
const WebSocket = require('ws'); // Import for WebSocket




//setting up your port
const PORT = process.env.PORT || 10001

//assigning the variable app to express
const app = express()

app.use(cors({
  origin: 'https://cli-based-rockpaperwhatever-nafisa-rafas-projects.vercel.app', // Use environment variable for client URL
  credentials: true,

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

// Start the Express server
const server = app.listen(PORT, '0.0.0.0', () => console.log(`Server is connected on ${PORT}`));

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
  
    let gameProcess = null;
  
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
  
      if (parsedMessage.type === 'moves') {
        const moves = parsedMessage.data;
  
        if (moves.length < 3 || moves.length % 2 === 0) {
          ws.send('Error: Please provide an odd number (≥ 3) of non-repeating moves.');
          return;
        }
  
        gameProcess = spawn('node', ['game.js', ...moves]);
  
        gameProcess.stdout.on('data', (data) => {
          ws.send(data.toString());
        });
  
        gameProcess.stderr.on('data', (data) => {
          ws.send(`Error: ${data.toString()}`);
        });
  
        gameProcess.on('exit', () => {
          ws.send('Game exited. Thanks for playing!');
          gameProcess = null;
        });
      } else if (parsedMessage.type === 'move' && gameProcess) {
        const userMove = parsedMessage.data.trim();
  
        if (!userMove.match(/^[0-9]+$|^\?$/)) {
          ws.send('Invalid input. Please enter a number corresponding to a move or "?" for help.');
          return;
        }
  
        gameProcess.stdin.write(`${userMove}\n`);
      }
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
      if (gameProcess) {
        gameProcess.kill();
      }
    });
  });