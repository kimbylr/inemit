import React, { FC, useEffect, useReducer, useRef, useState } from 'react';
import { FlagButton } from '../components/flag-button';
import { LearnProgress } from '../components/learn-progress';
import { Button } from '../elements/button';
import { Hint } from '../elements/hint';
import { Icon } from '../elements/icon';
import { ExtLink } from '../elements/link';
import { Spinner } from '../elements/spinner';
import { TextField } from '../elements/text-field';
import { evaluateAnswer } from '../helpers/evaluate-answer';
import { isMobileAppleDevice } from '../helpers/is-mobile-apple-device';
import { useApi } from '../hooks/use-api';
import { useHeight } from '../hooks/use-height';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { useSettings } from '../hooks/use-settings';
import { Hints, LearnItemForLearning, ListSummary } from '../models';
import { useAsyncEffect } from '../hooks/use-async-effect';

export const Learn: FC = () => {
  const height = useHeight();
  const { slug, goToList } = useRouting();
  const { getLearnItems, reportProgress } = useApi();
  const { lists } = useLists();
  const list = lists.find((list) => list.slug === slug);

  const [{ mode, data }, dispatch] = useReducer(reducer, getInitialData(list));
  const { items, item, currentIndex, count, isCorrect, answer } = data;

  const { hintDismissed, onDismissHint } = useSettings();
  const showFalseNegativeHint = !hintDismissed(Hints.learningFalseNegative);
  const showFlagHint = !hintDismissed(Hints.learningFlag) && currentIndex > 7;

  const answerFieldRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const correctionButtonRef = useRef<HTMLButtonElement>(null);

  // initial fetch
  useAsyncEffect(async () => {
    if (!list?.id) {
      return;
    }

    try {
      const items = await getLearnItems(list.id);
      if (items.length === 0) {
        window.alert('Nichts zu lernen :D');
        goToList(slug);
        return;
      }
      dispatch({ type: Action.START, items });
    } catch {
      window.alert('Fehler beim laden der Lerninhalte 0_ò');
      goToList(slug);
    }
  }, [list]);

  // focus input field when ready
  useEffect(() => {
    if (isMobileAppleDevice()) {
      // let user focus for scroll to work (◔_◔)
      return;
    }

    items && answerFieldRef.current?.focus();
  }, [items]);

  // if answer wasn't correct, use ⬆️/⬇️ to focus submit/correction button
  useEffect(() => {
    const handleFocus = (e: KeyboardEvent) => {
      if (!mode.includes('revising') || isCorrect || !['ArrowUp', 'ArrowDown'].includes(e.key)) {
        return;
      }

      document.activeElement === correctionButtonRef.current
        ? submitButtonRef.current?.focus()
        : correctionButtonRef.current?.focus();
    };

    document.addEventListener('keydown', handleFocus);
    return () => document.removeEventListener('keydown', handleFocus);
  }, [mode, isCorrect]);

  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (mode === 'end' && !saving) {
      goToList(slug);
      return;
    }

    // ugly as hell but necessary for iOS, cf. next() fn below
    if (mode === 'end' && answerFieldRef.current) {
      answerFieldRef.current.disabled = true;
      answerFieldRef.current.blur();
    }
  }, [mode, saving]);

  if (mode === 'init' || !list) {
    return (
      <div className="w-[100vw] p-4" style={{ height: height + 'px' }}>
        <header
          className="flex flex-row-reverse"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <button
            onClick={() => goToList(slug)}
            title="Zurück zur Übersicht"
            className="text-grey-75 hover:text-grey-50"
          >
            <Icon type="cancel" width="20px" />
          </button>
        </header>
        <main
          className="py-4 flex flex-col justify-evenly"
          style={{ height: `${height - 72}px` /* header 40 + container 2 * 16 */ }}
        >
          <Spinner />
        </main>
      </div>
    );
  }

  const next = async (overruleCorrect?: boolean) => {
    const answerQuality = overruleCorrect ? 3 : isCorrect ? 5 : 1; // TODO: more fine-grained?
    const save = async () => {
      setSaving(true);
      try {
        await reportProgress({ listId: list.id, itemId: item.id, answerQuality });
      } catch (error) {
        console.error('Speichern fehlgeschlagen:', error);
      } finally {
        setSaving(false);
      }
    };

    mode === 'revising' && save(); // don't save when repeating
    dispatch({ type: Action.NEXT, correct: answerQuality >= 3 });

    // iOS only displays the soft keyboard if an input is focused _in a click event fn_
    // to be changed soon? https://github.com/WebKit/WebKit/pull/2907
    if (answerFieldRef.current) {
      answerFieldRef.current.disabled = false; // can't focus before enabled (next render)
      answerFieldRef.current.focus();
    }
  };

  const { id: itemId, prompt, solution, flagged, image } = item;
  const revising = mode === 'revising' || mode === 'repeat-revising' || mode === 'end';
  const hasSpaceForImage = height > 600; // most likely soft keyboard

  return (
    <div className="w-[100vw] overflow-hidden fixed p-4" style={{ height: height + 'px' }}>
      <LearnProgress count={count} total={items.length} />
      <header className="flex justify-between" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <FlagButton
          flagged={flagged}
          onFlagged={(flagged) => dispatch({ type: Action.FLAG, itemId, flagged })}
          listId={list.id}
          itemId={itemId}
          onDismissHint={showFlagHint && (() => onDismissHint(Hints.learningFlag))}
        />
        <button
          onClick={() => goToList(slug)}
          title="Zurück zur Übersicht"
          className="text-grey-75 hover:text-grey-50"
        >
          <Icon type="cancel" width="20px" />
        </button>
      </header>

      <main
        className="py-4 flex flex-col justify-evenly"
        style={{ height: `${height - 72}px` /* header 40 + container 2 * 16 */ }}
      >
        <div
          className="mb-2 flex flex-col justify-evenly items-center text-center break-when-needed"
          style={{ fontSize: 'calc(0.75rem + 2vh + 2vw)', flexGrow: image ? 2 : 1 }}
        >
          {image && (
            <div
              className={`leading-[0] group ${
                hasSpaceForImage ? 'relative' : 'absolute opacity-25'
              }`}
            >
              <img
                srcSet={`${image.urls.small} 400w, ${image.urls.regular} 1080w`}
                sizes="calc(20vw + 25vh)"
                className="max-h-[calc(25vw+20vh)] max-w-[calc(20vw+25vh)] shadow-image"
              />
              <div className="absolute bottom-0 left-0 leading-none p-1 bg-opacity-50 bg-grey-10 text-xs text-grey-10 hidden group-hover:block">
                <ExtLink
                  href={`${image.user.link}?utm_source=inemit&utm_medium=referral`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {image.user.name}
                </ExtLink>
              </div>
            </div>
          )}
          {prompt}
        </div>
        <hr
          className={`w-full border-t-4 border-dotted border-grey-85 my-4 relative ${
            hasSpaceForImage ? 'top-4' : ''
          }`}
        />
        <form
          autoComplete="off"
          className="flex justify-center items-center grow"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="mr-5 relative">
            <TextField
              id="solution"
              autoCapitalize="none"
              ref={answerFieldRef}
              value={answer}
              disabled={revising}
              onChange={(e) => dispatch({ type: Action.TYPE, answer: e.target.value })}
              onFocus={() => {
                // prevent iOS from pushing content out of mode
                setTimeout(() => window.scrollTo({ top: 0 }), 200);
              }}
              className={`disabled:!delay-0 ${
                !revising
                  ? ''
                  : isCorrect
                  ? '!text-primary-150 !border-primary-100 !bg-primary-10'
                  : '!text-negative-100 !border-negative-100 !bg-negative-10 line-through'
              }`}
            />
            {revising && (
              <div
                className={`absolute h-[calc(100%-4px)] w-5 right-2 top-[2px] py-0.5 pr-0.5 flex items-center pointer-events-none ${
                  isCorrect ? 'text-primary-50 bg-primary-5' : 'text-negative-60 bg-negative-5'
                }`}
              >
                <Icon type={isCorrect ? 'ok' : 'deleteInCircle'} />
              </div>
            )}

            {revising && !isCorrect && (
              <div className="leading-[1.125] absolute text-center bottom-[60px] left-0 w-full">
                {showFalseNegativeHint && (
                  <Hint onDismiss={() => onDismissHint(Hints.learningFalseNegative)}>
                    Du findest, deine Antwort war richtig? Dann klick auf die grüne Korrektur. Sie
                    dient als "Hab ich doch gemeint!"-Knopf.
                  </Hint>
                )}
                <Correction
                  onClick={async (event) => {
                    event.preventDefault();
                    await next(true);
                    showFalseNegativeHint && onDismissHint(Hints.learningFalseNegative);
                  }}
                  disabled={mode === 'end'}
                  ref={correctionButtonRef}
                >
                  {solution}
                </Correction>
              </div>
            )}
            {revising && isCorrect && showRefinementHint(answer, solution) && (
              <div className="leading-[1.125] absolute text-center bottom-[60px] left-0 w-full">
                <Correction>{solution}</Correction>
              </div>
            )}
          </div>
          <Button
            primary
            type="submit"
            disabled={mode === 'end'}
            onClick={(event) => {
              event.preventDefault();
              if (revising) {
                next();
              } else {
                dispatch({ type: Action.CHECK });
                submitButtonRef.current?.focus();
              }
            }}
            ref={submitButtonRef}
            className="w-14"
          >
            <Icon width="16px" type={revising ? 'next' : 'done'} />
          </Button>
        </form>
      </main>
    </div>
  );
};

const Correction: FC<{
  onClick?: (event: React.MouseEvent) => Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
  ref?: React.ForwardedRef<HTMLButtonElement | any>;
}> = React.forwardRef(({ onClick, disabled, children }, ref) => {
  const Element = onClick ? 'button' : 'div';
  const triangleClasses =
    'absolute top-[100%] left-[50%] border-transparent border-solid h-0 w-0 pointer-events-none';

  return (
    <Element
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
      className={`min-w-[50%] max-w-full rounded p-2 break-when-needed leading-tight relative text-sm ${
        onClick
          ? 'bg-primary-10 border-[3px] border-primary-100 text-primary-100 font-bold'
          : 'bg-grey-95 border-2 border-grey-50 text-grey-25 font-light'
      } focus:shadow-blurry-focus outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {/* triangle border */}
      <span
        className={`${triangleClasses} ${
          onClick
            ? 'border-t-primary-100 border-[16px] -ml-4'
            : 'border-t-grey-50 border-[15px] ml-[-15px]'
        }`}
      />
      {/* triangle fill */}
      <span
        className={`${triangleClasses} border-[12px] -ml-3 ${
          onClick ? 'border-t-primary-10' : 'border-t-grey-95'
        }`}
      />
      {children}
    </Element>
  );
});

const showRefinementHint = (answer: string, solution: string) =>
  answer.toLowerCase().trim() !==
  solution
    .toLowerCase()
    .trim()
    .replaceAll(/[\(\)]/g, ''); // no refinement hint if answer included optional part in brackets

type State = {
  mode: 'init' | 'answering' | 'revising' | 'repeat-answering' | 'repeat-revising' | 'end';
  data: {
    items: LearnItemForLearning[];
    item: LearnItemForLearning;
    repeat: boolean;
    repeatItems: LearnItemForLearning[];
    answer: string;
    currentIndex: number;
    isCorrect: boolean;
    count: { correct: number; incorrect: number };
  };
};
const getInitialData = (list?: ListSummary): State => ({
  mode: 'init',
  data: {
    items: [],
    item: {} as LearnItemForLearning,
    repeat: list?.repeat || false,
    repeatItems: [],
    answer: '',
    currentIndex: 0,
    isCorrect: false,
    count: { correct: 0, incorrect: 0 },
  },
});

enum Action {
  START,
  TYPE,
  FLAG,
  CHECK,
  NEXT,
}
type Actions =
  | { type: Action.START; items: LearnItemForLearning[] }
  | { type: Action.TYPE; answer: string }
  | { type: Action.CHECK }
  | { type: Action.NEXT; correct: boolean }
  | { type: Action.FLAG; itemId: string; flagged: boolean };

const reducer = (state: State, action: Actions): State => {
  const { answer, items, item, currentIndex, count, repeat, repeatItems } = state.data;

  switch (action.type) {
    case Action.START:
      return {
        mode: 'answering',
        data: { ...state.data, items: action.items, item: action.items[0] },
      };

    case Action.TYPE:
      if (!state.mode.includes('answering')) return state;
      return { mode: state.mode, data: { ...state.data, answer: action.answer } };

    case Action.FLAG:
      return { ...state, data: { ...state.data, item: { ...item, flagged: action.flagged } } };

    case Action.CHECK:
      if (!state.mode.includes('answering')) return state;
      return {
        mode: state.mode === 'answering' ? 'revising' : 'repeat-revising',
        data: { ...state.data, isCorrect: evaluateAnswer(answer, item.solution) },
      };

    case Action.NEXT:
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
