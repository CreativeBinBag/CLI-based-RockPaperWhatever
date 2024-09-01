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

// Initialize WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    let moves = null;
    let gameProcess = null;

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'moves') {
            moves = parsedMessage.data;

            // Spawn the game process with the moves
            gameProcess = spawn('node', ['game.js', ...moves]);

            // Send the initial HMAC to the client
            gameProcess.stdout.on('data', (data) => {
                ws.send(data.toString() + "\n");
            });

            gameProcess.stderr.on('data', (data) => {
                console.error(`Game error: ${data}`);
            });

            gameProcess.on('exit', (code) => {
                ws.send(`Game exited with code ${code}`);
            });
        } else if (parsedMessage.type === 'move' && gameProcess) {
            const userMove = parsedMessage.data;

            if (!moves.includes(userMove)) {
                ws.send('Invalid input. Please select a valid move.');
                return;
            }

            // Write the user's move to the game process
            gameProcess.stdin.write(`${userMove}\n`);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
            gameProcess.kill();
   
    });
});