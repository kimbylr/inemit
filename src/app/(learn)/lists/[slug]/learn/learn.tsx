'use client';

import { FlagButton } from '@/components/flag-button';
import { updateItemProgress } from '@/db/actions';
import { Button } from '@/elements/button';
import { IconCrossCircle } from '@/elements/icons/cross-circle';
import { IconCrossThick } from '@/elements/icons/cross-thick';
import { IconDone } from '@/elements/icons/done';
import { IconItemEditSaved } from '@/elements/icons/item-edit-saved';
import { IconNext } from '@/elements/icons/next';
import { TextField } from '@/elements/text-field';
import { isMobileAppleDevice } from '@/helpers/is-mobile-apple-device';
import { merge } from '@/helpers/merge';
import { useHeight } from '@/hooks/use-height';
import { List } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useReducer, useRef, useState } from 'react';
import { LearnProgress } from './learn-progress';
import { LearnAction, getInitialLearnMachineData, learnMachine } from './state-machine';

export const Learn: FC<{ list: List<'items'> }> = ({ list }) => {
  const height = useHeight();
  const router = useRouter();
  const backToList = () => router.push(`/lists/${list.slug}`);

  const [{ mode, data }, dispatch] = useReducer(learnMachine, getInitialLearnMachineData(list));
  const { items, item, currentIndex, count, isCorrect, answer } = data;

  // const { hintDismissed, onDismissHint } = useSettings();
  // const showFalseNegativeHint = !hintDismissed(Hints.learningFalseNegative);
  // const showFlagHint = !hintDismissed(Hints.learningFlag) && currentIndex > 7;

  const answerFieldRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const correctionButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mode.includes('answering') && answerFieldRef.current?.focus();
  }, [mode]);

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
      backToList();
      return;
    }

    // ugly as hell but necessary for iOS, cf. next() fn below
    if (mode === 'end' && answerFieldRef.current) {
      answerFieldRef.current.disabled = true;
      answerFieldRef.current.blur();
    }
  }, [mode, saving]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = async (overruleCorrect?: boolean) => {
    const answerQuality = overruleCorrect ? 3 : isCorrect ? 5 : 1; // TODO: more fine-grained?
    const save = async () => {
      setSaving(true);
      try {
        await updateItemProgress({ listId: list.id, itemId: item.id, answerQuality });
      } catch (error) {
        console.error('Speichern fehlgeschlagen:', error);
      } finally {
        setSaving(false);
      }
    };

    mode === 'revising' && save(); // don't save when repeating
    dispatch({ type: LearnAction.NEXT, correct: answerQuality >= 3 });
  };

  const { id: itemId, prompt, promptAddition, solution, flagged, image } = item;
  const revising = mode === 'revising' || mode === 'repeat-revising' || mode === 'end';
  const hasSpaceForImage = height > 600; // most likely soft keyboard

  return (
    <div className="w-[100vw] overflow-hidden fixed p-4" style={{ height: height + 'px' }}>
      <LearnProgress count={count} total={items.length} />
      <header className="flex justify-between" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <span className="relative -left-1">
          <FlagButton
            flagged={flagged}
            onFlagged={(flagged) => dispatch({ type: LearnAction.FLAG, itemId, flagged })}
            listId={list.id}
            itemId={itemId}
            // onDismissHint={showFlagHint && (() => onDismissHint(Hints.learningFlag))}
          />
        </span>
        <button
          onClick={backToList}
          title="Zurück zur Übersicht"
          className="text-grey-75 hover:text-grey-50 dotted-focus dotted-focus-rounded h-6 w-6 flex justify-center relative -right-0.5"
        >
          <IconCrossThick className="w-5" />
        </button>
      </header>

      <main
        className="pt-4 flex flex-col justify-evenly"
        style={{ height: `${height - 72}px` /* header 40 + container 2 * 16 */ }}
      >
        <div
          className="mb-2 flex flex-col justify-evenly items-center text-center break-when-needed"
          style={{ flexGrow: image ? 2 : 1 }}
        >
          {image && (
            <div
              className={merge(
                'leading-[0] group',
                hasSpaceForImage ? 'relative' : 'absolute opacity-25',
              )}
            >
              <img
                srcSet={`${image.urls.small} 400w, ${image.urls.regular} 1080w`}
                sizes="calc(20vw + 25vh)"
                className={merge(
                  'max-w-[calc(20vw+25vh)] shadow-image',
                  hasSpaceForImage ? 'max-h-[50vh]' : 'max-h-[25vh]',
                )}
              />
              <div className="absolute bottom-0 left-0 leading-none p-1 rounded-tr bg-opacity-50 bg-grey-10 text-xxs text-grey-10 hidden group-hover:block">
                <a
                  href={`${image.user.link}?utm_source=inemit&utm_medium=referral`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-grey-85 hover:text-primary-100"
                >
                  {image.user.name}
                </a>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <span style={{ fontSize: 'calc(0.75rem + 2vh + 2vw)' }} className="text-grey-10">
              {prompt}
            </span>
            <span className="text-grey-60 text-md sm:text-lg">{promptAddition}</span>
          </div>
        </div>

        <hr
          className={`w-full border-t-4 border-dotted border-grey-85 my-4 relative ${
            hasSpaceForImage ? 'top-4' : ''
          }`}
        />

        <form
          autoComplete="off"
          className="flex justify-center items-center grow pt-6"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="mr-5 relative">
            <TextField
              id="solution"
              autoCapitalize="none"
              ref={answerFieldRef}
              value={answer}
              disabled={revising}
              onChange={(e) => dispatch({ type: LearnAction.TYPE, answer: e.target.value })}
              onFocus={() => {
                // prevent iOS from pushing content out of sight
                setTimeout(() => window.scrollTo({ top: 0 }), 200);
              }}
              className={merge(
                'disabled:!delay-0 max-w-[270px]',
                revising && 'pr-8',
                revising && isCorrect && '!text-primary-150 !border-primary-100 !bg-primary-10',
                revising &&
                  !isCorrect &&
                  '!text-negative-100 !border-negative-100 !bg-negative-10 line-through',
              )}
            />
            {revising && (
              <div
                className={merge(
                  'absolute h-[calc(100%-4px)] w-5 right-2 top-[2px] py-0.5 pr-0.5 flex items-center pointer-events-none',
                  isCorrect ? 'text-primary-50' : 'text-negative-60',
                )}
              >
                {isCorrect ? <IconItemEditSaved /> : <IconCrossCircle />}
              </div>
            )}

            {revising && !isCorrect && (
              <div className="leading-[1.125] absolute text-center bottom-[60px] left-0 w-full">
                {/* TODO {showFalseNegativeHint && (
                  <Hint onDismiss={() => onDismissHint(Hints.learningFalseNegative)}>
                    Du findest, deine Antwort war richtig? Dann klick auf die grüne Korrektur. Sie
                    dient als "Hab ich doch gemeint!"-Knopf.
                  </Hint>
                )} */}
                <Correction
                  onClick={async (event) => {
                    event.preventDefault();
                    await next(true);
                    // TODO showFalseNegativeHint && onDismissHint(Hints.learningFalseNegative);
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
                dispatch({ type: LearnAction.CHECK });
                submitButtonRef.current?.focus();
              }
            }}
            ref={submitButtonRef}
          >
            {revising ? <IconNext className="h-4 w-6" /> : <IconDone className="h-4 w-6" />}
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
      className={merge(
        'min-w-[50%] max-w-full rounded p-2 break-when-needed leading-tight relative text-sm',
        onClick
          ? 'bg-primary-10 border-[3px] border-primary-100 text-primary-100 font-bold'
          : 'bg-grey-95 border-2 border-grey-50 text-grey-25 font-light',
        'outline-none focus:shadow-blurry-focus disabled:opacity-50 disabled:cursor-not-allowed',
      )}
    >
      {/* triangle border */}
      <span
        className={merge(
          triangleClasses,
          onClick
            ? 'border-t-primary-100 border-[16px] -ml-4'
            : 'border-t-grey-50 border-[15px] ml-[-15px]',
        )}
      />
      {/* triangle fill */}
      <span
        className={merge(
          triangleClasses,
          'border-[12px] -ml-3',
          onClick ? 'border-t-primary-10' : 'border-t-grey-95',
        )}
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
