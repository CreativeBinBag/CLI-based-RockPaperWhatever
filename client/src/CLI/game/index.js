import React, { useState } from 'react';
import { render, Text, Box, Newline, Static, useInput } from 'ink';
import { getHelpTable } from "./helpTable";
import { generateKey, calculateHMAC } from "./generateKey";
import { determineWinner, isValidArgs, getComputerMove } from './gameLogic';
import { Gradient } from 'ink-gradient';
import { BigText } from 'ink-big-text';

export const CLIApp = ({ args }) => {
  const [userMove, setUserMove] = useState(null);
  const [gameState, setGameState] = useState('awaitingUserInput');
  const [error, setError] = useState(null);

  useInput((input, key) => {
    if (key.escape) {
      process.exit();
    }

    if (gameState === 'awaitingUserInput') {
      const moveIndex = parseInt(input.trim(), 10) - 1;
      if (moveIndex >= 0 && moveIndex < args.length) {
        const userMove = args[moveIndex];
        const key = generateKey();
        const computerMove = getComputerMove(args);
        const hmac = calculateHMAC(key, computerMove);

        const result = determineWinner(args, computerMove, userMove);
        setUserMove(userMove);
        setGameState('result');
        console.log(`User chose: ${userMove}`);
        console.log(`Computer chose: ${computerMove}`);
        console.log(`HMAC: ${hmac}`);
        console.log(`Result: ${result}`);
      } else {
        setError("Invalid move. Please select a valid option.");
      }
    }
  });

  if (!isValidArgs(args)) {
    return (
      <Box>
        <Text color="red">Error: Invalid number of arguments. Please provide an odd number of moves.</Text>
        <Newline />
        <Text>Example: node index.js Rock Paper Scissors</Text>
      </Box>
    );
  }

  const helpTable = getHelpTable(args);

  return (
    <Box flexDirection="column" padding={1}>
      <Gradient name="summer">
        <BigText text="Welcome to Rock Paper Scissors" align='center' font='chrome' />
      </Gradient>
      <Newline />
      <Text>Computer has made a move. Please choose your move from the menu below:</Text>
      <Newline />
      <Box>
        {args.map((move, index) => (
          <Text key={index}>{index + 1} - {move}{'\n'}</Text>
        ))}
        <Text>0 - Exit</Text>
        <Newline />
      </Box>
      <Newline />
      <Static>
        <Text>Help:</Text>
        <Newline />
        <Text>{helpTable}</Text>
      </Static>
      {error && <Text color="red">{error}</Text>}
    </Box>
  );
};

const args = process.argv.slice(2);
render(<CLIApp args={args} />);
