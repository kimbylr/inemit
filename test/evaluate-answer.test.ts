import { evaluateAnswer } from '../src/helpers/evaluate-answer';

const tests = [
  {
    name: 'trim',
    solution: 'gurke',
    correctAnswers: [' gurke', 'gurke   ', '   gurke   '],
    wrongAnswers: ['', 'gurke,', 'gruke', 'f gurke', 'gurk', '+gurk', '-gurk'],
  },
  {
    name: 'ignore case',
    solution: 'gruyère',
    correctAnswers: ['GRUYère', 'gruyère', 'gruyÈre', 'GRUYÈRE'],
    wrongAnswers: ['', 'gruyere,', 'GRUYERE'],
  },
  {
    name: 'initial parenthesis',
    solution: '(la) sabbia',
    correctAnswers: ['sabbia', 'la sabbia'],
    wrongAnswers: ['', 'la', 'la sabbbia', 'lla sabbia', 'la sa', 'yolo'],
  },
  {
    name: 'final parenthesis',
    solution: 'peggio (di ieri)',
    correctAnswers: ['peggio', 'peggio di ieri', 'peggio (di ieri)'],
    wrongAnswers: [''],
  },
  {
    name: 'middle parenthesis',
    solution: 'tanto (altrettanto) stupido',
    correctAnswers: ['tanto (altrettanto) stupido', 'tanto stupido'],
    wrongAnswers: [''],
  },
  {
    name: 'middle parenthesis with special symbols',
    solution: `letto (['lɛtːo]) grande`,
    correctAnswers: ['letto grande'],
    wrongAnswers: [''],
  },
  {
    name: 'middle parenthesis and punctuation',
    solution: 'tanto (altrettanto) stupido …',
    correctAnswers: ['tanto (altrettanto) stupido', 'tanto stupido'],
    wrongAnswers: [''],
  },
  {
    name: 'parenthesis before and after',
    solution: "(il) letto (['lɛtːo])",
    correctAnswers: ['letto', 'il letto'],
    wrongAnswers: [''],
  },
  {
    name: 'multi-parenthesis',
    solution: 'vänja (vande) sig (vid)',
    correctAnswers: ['vänja sig', 'vänja sig vid'],
    wrongAnswers: ['', 'vänja', 'sig', 'vande', 'vande vid'],
  },
  {
    name: 'multi-parenthesis 2',
    solution: '(1) 2 (3)',
    correctAnswers: ['1 2', '2', '1 2 3', '2 3'],
    wrongAnswers: ['', '1 3', '1', '3'],
  },
  {
    name: 'multi-parenthesis 3',
    solution: '1 (2) 3 (4) (5) (6)',
    correctAnswers: ['1 3', '1 2 3', '1 3 5', '1 3 6', '1 3 4 5 6'],
    wrongAnswers: ['', '2 3', '1 2', '4 5 6'],
  },
  {
    name: 'comma and parentheses',
    solution: '(la) lite, (il) litigio',
    correctAnswers: ['lite', 'la lite', 'il litigio', 'litigio'],
    wrongAnswers: ['', 'la', 'il'],
  },
  {
    name: 'special signs in parenthesis',
    solution: 'chiaro!, sicuro!',
    correctAnswers: ['chiaro', 'sicuro', 'chiaro!', 'sicuro!'],
    wrongAnswers: ['!'],
  },
  {
    name: 'parenthesis with comma inside',
    solution: '(la) pena (capitale, di morte)',
    correctAnswers: ['la pena', 'pena'], // pena capitale, pena di morte: too complicated
    wrongAnswers: ['la'],
  },
  {
    name: 'parenthesis with comma inside and another solution',
    solution: '(la) pena (capitale, di morte), (la) punizione',
    correctAnswers: ['la pena', 'pena', 'punizione', 'la punizione'], // pena capitale, pena di morte: too complicated
    wrongAnswers: ['la'],
  },
  {
    name: 'empty is never a solution',
    solution: 'A differenza di quel che si pensa, …',
    correctAnswers: ['A differenza di quel che si pensa'],
    wrongAnswers: [''],
  },
];

tests.map(({ name, solution, correctAnswers, wrongAnswers }) => {
  test(name, () => {
    for (const answer of correctAnswers) {
      expect(evaluateAnswer(answer, solution)).toBe(true);
    }
    for (const answer of wrongAnswers) {
      expect(evaluateAnswer(answer, solution)).toBe(false);
    }
  });
});
