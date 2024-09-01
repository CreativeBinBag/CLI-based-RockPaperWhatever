const crypto = require('crypto');

// Validate the moves passed as command line arguments
const moves = process.argv.slice(2);
if (moves.length < 3 || moves.length % 2 === 0) {
    console.error("Error: Please provide an odd number (≥ 3) of non-repeating moves.");
    console.error("Example: node game.js Rock Paper Scissors");
    process.exit(1);
}

// Generate a cryptographic key
const key = crypto.randomBytes(32).toString('hex');

// Randomly select a move for the computer
const computerMove = moves[Math.floor(Math.random() * moves.length)];

// Generate HMAC using the selected computer move
const hmac = crypto.createHmac('sha256', key).update(computerMove).digest('hex');

// Display the HMAC to the user
console.log(`HMAC: ${hmac}`);

let inputBuffer = '';

process.stdin.on('data', (data) => {
    inputBuffer += data.toString();

    // Split the input buffer by newlines or spaces
    let lines = inputBuffer.split(/\r?\n/);

    // Process all lines except the last one (which may be incomplete)
    lines.slice(0, -1).forEach(line => {
        const userMoveIndex = parseInt(line.trim(), 10) - 1;
        if (userMoveIndex >= 0 && userMoveIndex < moves.length) {
            const userMove = moves[userMoveIndex];

            // Determine the winner based on the circle of moves
            const userIndex = moves.indexOf(userMove);
            const computerIndex = moves.indexOf(computerMove);
            const half = Math.floor(moves.length / 2);

            if (userIndex === computerIndex) {
                console.log("Draw!");
            } else if ((computerIndex > userIndex && computerIndex - userIndex <= half) ||
                       (userIndex > computerIndex && userIndex - computerIndex > half)) {
                console.log("Computer Wins!");
            } else {
                console.log("You Win!");
            }

            console.log(`Computer move: ${computerMove}`);
            console.log(`Key: ${key}`);

            process.exit(0);
        } else {
            console.log("Invalid input. Please select a valid move.");
        }
    });

    // Keep the last part of the input buffer
    inputBuffer = lines[lines.length - 1];
});
