const crypto = require('crypto');
const readline = require('readline');
const moves = process.argv.slice(2);


const terminalWidth = process.stdout.columns || 120;
const padding = 2;

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
    
    // Adjust the separator width to align with terminal width
    const totalWidth = terminalWidth - padding * (moves.length + 1);
    const colWidth = Math.max(Math.floor(totalWidth / (moves.length + 1)), 7); // Ensuring a minimum width

    // Create the separator line dynamically based on column width and number of columns
    const separator = `+${'-'.repeat(colWidth + padding)}+`.repeat(moves.length + 1) + '\n';

    let table = `\n${separator}`;

    // Header row with aligned columns
    table += `| ${''.padEnd(colWidth)} |`;  // Empty top-left corner
    moves.forEach(move => {
        table += ` ${move.padEnd(colWidth)} |`;
    });
    table += `\n${separator}`;

    // Rows for each move
    moves.forEach((move, i) => {
        let row = `| ${move.padEnd(colWidth)} |`;  // Row header
        moves.forEach((_, j) => {
            if (i === j) {
                row += ` ${'Draw'.padEnd(colWidth)} |`;
            } else if ((j > i && j - i <= half) || (i > j && i - j > half)) {
                row += ` ${'Lose'.padEnd(colWidth)} |`;
            } else {
                row += ` ${'Win'.padEnd(colWidth)} |`;
            }
        });
        row += `\n${separator}`;
        table += row;
    });

    return table;
};


// Available moves display
console.log("\nAvailable moves:\n");
moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
});
console.log("0 - exit\n");
console.log("? - help table\n");

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
