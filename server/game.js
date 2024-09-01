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

process.stdin.on('data', (data) => {
        const userMove = data.toString().trim();
    if (moves.includes(userMove)) {
        const userIndex = moves.indexOf(userMove);
        const computerIndex = moves.indexOf(computerMove);
        const half = Math.floor(moves.length / 2);

        if (userIndex === computerIndex) {
            console.log("\nDraw!");
            process.stdout.write('\n');
        } else if ((computerIndex > userIndex && computerIndex - userIndex <= half) ||
                   (userIndex > computerIndex && userIndex - computerIndex > half)) {
            console.log("\nComputer Wins!");
            process.stdout.write('\n');

        } else {
            console.log("\nYou Win!");
            process.stdout.write('\n');
        }

        console.log(`\nComputer move: ${computerMove}`);
        console.log(`\nKey: ${key}`);
        process.stdout.write('\n');
        process.exit(0);
    } else {
        console.log("\nInvalid input. Please select a valid move.");
        process.stdout.write('\n');
    }
});
