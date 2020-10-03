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
