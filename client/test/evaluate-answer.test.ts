import { evaluateAnswer } from '../src/helpers/evaluate-answer';

test('trim', () => {
  const solution = 'gurke';
  const correctAnswers = [' gurke', 'gurke   ', '   gurke   '];
  const wrongAnswers = [
    'gurke,',
    'gruke',
    'f gurke',
    'gurk',
    '+gurk',
    '-gurk',
    '',
  ];

  for (const answer of correctAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(true);
  }

  for (const answer of wrongAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(false);
  }
});

test('ignore case', () => {
  const solution = 'gruyère';
  const correctAnswers = ['GRUYère', 'gruyère', 'gruyÈre', 'GRUYÈRE'];
  const wrongAnswers = ['gruyere,', 'GRUYERE', ''];

  for (const answer of correctAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(true);
  }

  for (const answer of wrongAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(false);
  }
});

test('initial parenthesis', () => {
  const solution = '(la) sabbia';
  const correctAnswers = ['sabbia', 'la sabbia'];
  const wrongAnswers = ['la', 'la sabbbia', 'lla sabbia', 'la sa', 'yolo', ''];

  for (const answer of correctAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(true);
  }

  for (const answer of wrongAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(false);
  }
});

test('final parenthesis', () => {
  const solution = 'peggio (di ieri)';
  const correctAnswers = ['peggio', 'peggio di ieri', 'peggio (di ieri)'];
  const wrongAnswers = [''];

  for (const answer of correctAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(true);
  }

  for (const answer of wrongAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(false);
  }
});

test('middle parenthesis', () => {
  const solution = 'tanto (altrettanto) stupido';
  const correctAnswers = ['tanto (altrettanto) stupido', 'tanto stupido'];
  const wrongAnswers = [''];

  for (const answer of correctAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(true);
  }

  for (const answer of wrongAnswers) {
    evaluateAnswer(answer, solution);
    expect(evaluateAnswer(answer, solution)).toBe(false);
  }
});
