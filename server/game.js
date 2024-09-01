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

const generateHelpTable = (moves) => {
    const half = Math.floor(moves.length / 2);
    let table = `\n+${'-'.repeat(moves.length * 8 + 1)}+\n`;
    table += `|          |${moves.map(move => `  ${move}  |`).join('')}\n`;
    table += `+${'-'.repeat(moves.length * 8 + 1)}+\n`;

    moves.forEach((move, i) => {
        let row = `|  ${move.padEnd(8)}|`;
        moves.forEach((_, j) => {
            if (i === j) {
                row += `  \x1b[33mDraw\x1b[0m  |`;
            } else if ((j > i && j - i <= half) || (i > j && i - j > half)) {
                row += `  \x1b[31mLose\x1b[0m  |`;
            } else {
                row += `  \x1b[32mWin \x1b[0m  |`;
            }
        });
        row += `\n+${'-'.repeat(moves.length * 8 + 1)}+\n`;
        table += row;
    });

    return table;
};

console.log("Available moves:");
moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
});
console.log("0 - exit");
console.log("? - help table");

process.stdin.on('data', (data) => {
    const userMove = data.toString().trim();
    if (userMove === '?') {
        console.log(generateHelpTable(moves));
    } else if (moves.includes(userMove)) {
        const userIndex = moves.indexOf(userMove);
        const computerIndex = moves.indexOf(computerMove);
        const half = Math.floor(moves.length / 2);

        if (userIndex === computerIndex) {
            console.log("It's a draw!");
        } else if ((computerIndex > userIndex && computerIndex - userIndex <= half) ||
                   (userIndex > computerIndex && userIndex - computerIndex > half)) {
            console.log("Computer Wins!");
        } else {
            console.log("You Win!");
        }

        console.log(`Computer move: ${computerMove}`);
        console.log(`HMAC key: ${key}`);
        process.exit(0);
    } else {
        console.log("Invalid input. Please select a valid move.");
    }
});
