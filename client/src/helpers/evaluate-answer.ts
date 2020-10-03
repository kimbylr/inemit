export const evaluateAnswer = (answer: string, solution: string): boolean => {
  const bareSolution = solution.replace(/[.…?!]/g, ''); // without punctuation (also stripped for answer)
  const splitSolutions = discardInitialBracket(bareSolution).split(/[,;()]+/); // NB: solution phrases with commas are split up
  const stripBrackets = bareSolution.replace(/[().…?!]/g, ''); // "(a) word" => "a word"
  const stripBracketedContent = bareSolution.replace(/ ?\(.+\)+/g, ''); // "the (a) word" => "the word"

  const solutions = [
    bareSolution,
    ...splitSolutions,
    stripBrackets,
    stripBracketedContent,
  ]
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
