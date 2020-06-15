export const evaluateAnswer = (answer: string, solution: string): boolean => {
  const splitSolutions = discardInitialBracket(solution)
    .replace(/[.…?!]/g, '')
    .split(/[,;()]+/); // NB: solution phrases with commas are split up
  const stripBrackets = solution.replace(/[()]/g, ''); // "(a) word" => "a word"
  const stripBracketed = solution.replace(/ ?\(.+\)+/g, ''); // "the (a) word" => "the word"

  const solutions = [...splitSolutions, stripBrackets, stripBracketed, solution]
    .map(solution => solution.trim().toLowerCase())
    .filter(Boolean);

  return solutions.includes(
    answer
      .replace(/[.?!]/g, '')
      .trim()
      .toLowerCase(),
  );
};

// don't use initial bracketed content as a solution
// e.g. in "(the) word", "the" is not a solution
const discardInitialBracket = (solution: string): string =>
  solution.split(/^\(\w+\)/).pop()!;
