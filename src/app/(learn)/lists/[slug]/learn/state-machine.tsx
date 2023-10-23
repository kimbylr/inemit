import { evaluateAnswer } from '@/helpers/evaluate-answer';
import { LearnItem, List } from '@/types/types';

export type State = {
  mode: 'answering' | 'revising' | 'repeat-answering' | 'repeat-revising' | 'end';
  data: {
    items: LearnItem[];
    item: LearnItem;
    repeat: boolean;
    repeatItems: LearnItem[];
    answer: string;
    currentIndex: number;
    isCorrect: boolean;
    count: { correct: number; incorrect: number };
  };
};
export const getInitialLearnMachineData = (list: List<'items'>): State => ({
  mode: 'answering',
  data: {
    items: list.items,
    item: list.items[0],
    repeat: list?.repeat || false,
    repeatItems: [],
    answer: '',
    currentIndex: 0,
    isCorrect: false,
    count: { correct: 0, incorrect: 0 },
  },
});

export enum LearnAction {
  TYPE,
  FLAG,
  CHECK,
  NEXT,
}
type Actions =
  | { type: LearnAction.TYPE; answer: string }
  | { type: LearnAction.CHECK }
  | { type: LearnAction.NEXT; correct: boolean }
  | { type: LearnAction.FLAG; itemId: string; flagged: boolean };

export const learnMachine = (state: State, action: Actions): State => {
  const { answer, items, item, currentIndex, count, repeat, repeatItems } = state.data;

  switch (action.type) {
    case LearnAction.TYPE:
      if (!state.mode.includes('answering')) return state;
      return { mode: state.mode, data: { ...state.data, answer: action.answer } };

    case LearnAction.FLAG:
      return { ...state, data: { ...state.data, item: { ...item, flagged: action.flagged } } };

    case LearnAction.CHECK:
      if (!state.mode.includes('answering')) return state;
      return {
        mode: state.mode === 'answering' ? 'revising' : 'repeat-revising',
        data: { ...state.data, isCorrect: evaluateAnswer(answer, item.solution) },
      };

    case LearnAction.NEXT:
      if (!state.mode.includes('revising')) return state;

      const newRepeatItems = repeat ? [...repeatItems, ...(action.correct ? [] : [item])] : [];
      const nextItem = items[currentIndex + 1] || newRepeatItems[currentIndex - items.length + 1];
      const newCount = getCount(count, action.correct, state.mode === 'repeat-revising');

      if (!nextItem) {
        return { mode: 'end', data: { ...state.data, count: newCount } };
      }

      return {
        mode:
          newCount.correct + newCount.incorrect >= items.length ? 'repeat-answering' : 'answering',
        data: {
          ...state.data,
          currentIndex: currentIndex + 1,
          item: nextItem,
          count: newCount,
          answer: '',
          repeatItems: newRepeatItems,
        },
      };

    default:
      return state;
  }
};

const getCount = (
  count: { correct: number; incorrect: number },
  correct: boolean,
  repeating?: boolean,
) => {
  const newCount = { ...count };
  if (correct) newCount.correct++;
  if (!correct && !repeating) newCount.incorrect++;
  if (correct && repeating) newCount.incorrect--;
  return newCount;
};
