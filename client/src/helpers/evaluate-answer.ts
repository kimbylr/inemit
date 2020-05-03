// TODO: make clever and robust
export const evaluateAnswer = (answer: string, solution: string): boolean => {
  const solutions = solution
    .replace(/[.?!]/g, '')
    .split(/[,;()]+/)
    .map(solution => solution.trim().toLowerCase())
    .filter(Boolean);

  return solutions.includes(
    answer
      .replace(/[.?!]/g, '')
      .trim()
      .toLowerCase(),
  );
};
