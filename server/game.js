const crypto = require('crypto');
const readline = require('readline');

// Validate the moves passed as command line arguments
const moves = process.argv.slice(2);
if (moves.length < 3 || moves.length % 2 === 0) {
    console.error("Error: Please provide an odd number (≥ 3) of non-repeating moves.");
    console.error("Example: node game.js rock paper scissors");
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
    const colWidth = 20; // Adjust this width based on your longest move and padding needs
    const separator = `+${'-'.repeat(colWidth * moves.length + moves.length + 1)}+\n`;
    let table = `\n${separator}`;

    // Header row
    table += `| ${''.padEnd(colWidth)}|`;
    moves.forEach(move => {
        table += ` ${move.padEnd(colWidth - 1)}|`;
    });
    table += `\n${separator}`;

    // Each move row
    moves.forEach((move, i) => {
        let row = `| ${move.padEnd(colWidth - 1)}|`;
        moves.forEach((_, j) => {
            if (i === j) {
                row += ` ${`\x1b[33mDraw\x1b[0m`.padEnd(colWidth)}|`;
            } else if ((j > i && j - i <= half) || (i > j && i - j > half)) {
                row += ` ${`\x1b[31mLose\x1b[0m`.padEnd(colWidth)}|`;
            } else {
                row += ` ${`\x1b[32mWin\x1b[0m`.padEnd(colWidth)}|`;
            }
        });
        row += `\n${separator}`;
        table += row;
    });

    return table;
};

// Available moves display
console.log("Available moves:");
moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
});
console.log("0 - exit");
console.log("? - help table");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if (input === '0') {
        console.log('Exiting game...');
        rl.close();
        process.exit(0);
    } else if (input === '?') {
        console.log(generateHelpTable(moves));
    } else {
        const moveIndex = parseInt(input) - 1;
        if (moveIndex >= 0 && moveIndex < moves.length) {
            const userMove = moves[moveIndex];
            const userIndex = moves.indexOf(userMove);
            const computerIndex = moves.indexOf(computerMove);
            const half = Math.floor(moves.length / 2);

            console.log(`Your move: ${userMove}`);
            console.log(`Computer move: ${computerMove}`);

            if (userIndex === computerIndex) {
                console.log("It's a draw!");
            } else if ((computerIndex > userIndex && computerIndex - userIndex <= half) ||
                (userIndex > computerIndex && userIndex - computerIndex > half)) {
                console.log("Computer Wins!");
            } else {
                console.log("You Win!");
            }

            console.log(`HMAC key: ${key}`);
            rl.close();
            process.exit(0);
        } else {
            console.log("Invalid input. Please select a valid move.");
        }
    }
});
