export const isValidArgs = (args) => {
  const numArgs = args.length;
  return numArgs >= 3 && numArgs % 2 === 1 && new Set(args).size === numArgs;
}

export const determineWinner = (moves, move1, move2) => {
  const numMoves = moves.length;
  const index1 = moves.indexOf(move1);
  const index2 = moves.indexOf(move2);
  if (index1 === -1 || index2 === -1) return null;

  const half = Math.floor(numMoves / 2);
  return (index1 + half) % numMoves === index2 ? move1 : move2;
}

export const getComputerMove = (moves) => {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};
