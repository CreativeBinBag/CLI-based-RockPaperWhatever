const crypto = require('crypto');
const readline = require('readline');

const moves = process.argv.slice(2);

// Generate a cryptographic key
const key = crypto.randomBytes(32).toString('hex');

// Randomly select a move for the computer
const computerMove = moves[Math.floor(Math.random() * moves.length)];

// Generate HMAC using the selected computer move
const hmac = crypto.createHmac('sha256', key).update(computerMove).digest('hex');

// Display the HMAC to the user
console.log(`\nHMAC: ${hmac}`);

const generateHelpTable = (moves) => {
    const half = Math.floor(moves.length / 2);
    const colWidth = 10; // Adjust this width based on your longest move and padding needs
    const separator = '+'.padEnd((colWidth + 1) * (moves.length + 1), '-') + '+\n';
    let table = `\n${separator}`;

    table += '|'.padEnd(colWidth + 1) + '|';
    moves.forEach(move => {
        table += ` ${move.padEnd(colWidth - 2)}|`;
    });
    table += `\n${separator}`;

    moves.forEach((move, i) => {
        let row = `| ${move.padEnd(colWidth - 2)}|`;
        moves.forEach((_, j) => {
            if (i === j) {
                row += ` Draw     |`;
            } else if ((j > i && j - i <= half) || (i > j && i - j > half)) {
                row += ` Lose     |`;
            } else {
                row += ` Win      |`;
            }
        });
        row += `\n${separator}`;
        table += row;
    });

    return table;
};

// Available moves display
console.log("\nAvailable moves:");
moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
});
console.log("\n0 - exit");
console.log("\n? - help table");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if (input === '0') {
        console.log('\nExiting game...');
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

            console.log(`\nYour move: ${userMove}`);
            console.log(`\nComputer move: ${computerMove}`);

            if (userIndex === computerIndex) {
                console.log("\nIt's a draw!");
            } else if ((computerIndex > userIndex && computerIndex - userIndex <= half) ||
                (userIndex > computerIndex && userIndex - computerIndex > half)) {
                console.log("\nComputer Wins!");
            } else {
                console.log("\nYou Win!");
            }

            console.log(`\nHMAC key: ${key}`);
            rl.close();
            process.exit(0);
        } else {
            console.log("\nInvalid input. Please select a valid move.");
        }
    }
});
