export const getHelpTable = (moves) => {
  const numMoves = moves.length;

  // Create the header row
  const header = ['Move', ...moves].join('\t');

  // Create the rows for the help table
  const rows = moves.map((move, i) => {
    // Create each row with the move and results
    const results = moves.map((_, j) => {
      if (i === j) {
        return 'Draw';
      } else if ((i + Math.floor(numMoves / 2)) % numMoves === j) {
        return 'Win';
      } else {
        return 'Lose';
      }
    }).join('\t');

    return [move, ...results].join('\t');
  });

  // Combine header and rows into the final table
  return [header, ...rows].join('\n');
};
