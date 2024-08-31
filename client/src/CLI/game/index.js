import React, { useState } from 'react';
import TerminalComponent from './TerminalComponent';
import { getHelpTable } from './helpTable';
import { generateKey, calculateHMAC } from './generateKey';
import { determineWinner, isValidArgs, getComputerMove } from './gameLogic';

const CLIApp = ({ args }) => {
  const [gameState, setGameState] = useState('awaitingUserInput');
  const [error, setError] = useState(null);
  const [helpTable, setHelpTable] = useState(getHelpTable(args));

  const handleCommand = (command) => {
    if (!isValidArgs(args)) {
      setError("Invalid number of arguments. Please provide an odd number of moves.");
      return;
    }

    const moveIndex = parseInt(command.trim(), 10) - 1;
    if (moveIndex >= 0 && moveIndex < args.length) {
      const userMove = args[moveIndex];
      const key = generateKey();
      const computerMove = getComputerMove(args);
      const hmac = calculateHMAC(key, computerMove);
      const result = determineWinner(args, computerMove, userMove);

      setGameState('result');
      console.log(`User chose: ${userMove}`);
      console.log(`Computer chose: ${computerMove}`);
      console.log(`HMAC: ${hmac}`);
      console.log(`Result: ${result}`);
    } else {
      setError("Invalid move. Please select a valid option.");
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <TerminalComponent onCommand={handleCommand} />
      <pre>{helpTable}</pre>
    </div>
  );
};

export default CLIApp;
