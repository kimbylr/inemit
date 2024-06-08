export const evaluateAnswer = (answer: string, solution: string): boolean => {
  const bareSolution = solution.replace(/[.…?!]/g, ''); // remove punctuation (also stripped for answer)
  const splitSolutions = bareSolution.split(/[,;]+/); // NB: solution phrases with commas are split up
  const splitSolutionsCommaInParentheses = bareSolution.split(/\([^)]*,(?=[^()]*\))/); // cuts " (da," in "bla (da, bli), blo"
  const solutionsWithBrackets = Array.from(
    new Set([bareSolution, ...splitSolutions, ...splitSolutionsCommaInParentheses]),
  );

  const solutions = solutionsWithBrackets.flatMap(getSolutions).map(normalise).filter(Boolean); // filter ""
  const normalisedAnswer = normalise(answer.replace(/[.?!()]/g, ''));
  return solutions.includes(normalisedAnswer);
};

const getSolutions = (solutionWithBrackets: string): string[] => {
  const optionalParts = (solutionWithBrackets.match(/\((.*?)\)/g) || [])
    .filter(Boolean)
    .map((part) => part.replace(/[()]/g, ''));

  const parts = solutionWithBrackets
    .split(/[()]/)
    .filter(Boolean)
    .map((part) => ({ part, required: !optionalParts.includes(part) }));

  const solutions = getSolutionCombinations(parts);
  return solutions.map((solution) => solution.replace(/\s{2,}/g, ' ')); // remove double spaces
};

const getSolutionCombinations = (parts: { part: string; required: boolean }[]): string[] => {
  if (parts.every(({ required }) => required || parts.every(({ required }) => !required))) {
    return [parts.map(({ part }) => part).join('')];
  }

  const partsWithIndex = parts.map((data, i) => ({ ...data, i }));
  const requiredIndexes = partsWithIndex.filter(({ required }) => required).map(({ i }) => i);
  const optionalIndexes = partsWithIndex.filter(({ required }) => !required).map(({ i }) => i);

  // "(1) 2 (3)" => ["1 2 3", "2 3"]
  const combos = optionalIndexes.map((_, i, arr) =>
    sort([...arr.slice(i), ...requiredIndexes])
      .map((j) => parts[j].part)
      .join(''),
  );

  const firstOptionalRemoved = partsWithIndex.filter(({ i }) => i !== optionalIndexes.at(-1));
  return [...combos, ...getSolutionCombinations(firstOptionalRemoved)];
};

const sort = (arr: number[]) => {
  const sorted = [...arr];
  sorted.sort();
  return sorted;
};

const normalise = (s: string) => s.trim().toLowerCase();
