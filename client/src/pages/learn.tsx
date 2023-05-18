import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
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
import { Hints, LearnItemForLearning } from '../models';

export const Learn: FC = () => {
  const height = useHeight();
  const { slug, goToList } = useRouting();
  const { getLearnItems, reportProgress } = useApi();

  const { lists } = useLists();
  const list = lists.find((list) => list.slug === slug);

  const [items, setItems] = useState<LearnItemForLearning[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revising, setRevising] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [count, setCount] = useState({ correct: 0, incorrect: 0 });
  const [disableNext, setDisableNext] = useState(false);

  const { hintDismissed, onDismissHint } = useSettings();
  const showFalseNegativeHint = !hintDismissed(Hints.learningFalseNegative);
  const showFlagHint = !hintDismissed(Hints.learningFlag) && current > 7;

  const answerFieldRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const correctionButtonRef = useRef<HTMLButtonElement>(null);

  const load = async (listId: string) => {
    try {
      const learnItems = await getLearnItems(listId);
      if (learnItems.length === 0) {
        window.alert('Nichts zu lernen :D');
        goToList(slug);
      }
      setItems(learnItems);
    } catch {
      window.alert('Fehler beim laden der Lerninhalte 0_ò');
      goToList(slug);
    }
  };
  useEffect(() => {
    list && load(list.id);
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
      if (!revising || isCorrect || !['ArrowUp', 'ArrowDown'].includes(e.key)) {
        return;
      }

      document.activeElement === correctionButtonRef.current
        ? submitButtonRef.current?.focus()
        : correctionButtonRef.current?.focus();
    };

    document.addEventListener('keydown', handleFocus);
    return () => document.removeEventListener('keydown', handleFocus);
  }, [revising]);

  if (!list || !items) {
    return (
      <Container height={height}>
        <Header>
          <StyledLinkButton onClick={() => goToList(slug)} title="Zurück zur Übersicht">
            <Icon type="cancel" width="20px" />
          </StyledLinkButton>
        </Header>
        <Content height={height}>
          <Spinner />
        </Content>
      </Container>
    );
  }

  const { id: itemId, prompt, solution, flagged, image } = items[current];

  const check = () => {
    setIsCorrect(evaluateAnswer(answer, solution));
    submitButtonRef.current?.focus();
    setRevising(true);
  };

  const updateCount = (wasCorrect: boolean) => {
    const correct = count.correct + (wasCorrect ? 1 : 0);
    const incorrect = count.incorrect + (!wasCorrect ? 1 : 0);
    setCount({ correct, incorrect });
  };

  const save = async (answerQuality: 5 | 3 | 1) => {
    updateCount(answerQuality >= 3);

    try {
      await reportProgress({ listId: list.id, itemId, answerQuality });
    } catch (error) {
      console.error('Speichern fehlgeschlagen:', error);
    }
  };

  const next = async (overruleCorrect?: boolean) => {
    // TODO: more fine-grained
    const answerQuality = overruleCorrect ? 3 : isCorrect ? 5 : 1;

    if (current + 1 >= items.length) {
      setDisableNext(true);
      await save(answerQuality);
      goToList(slug);
      return;
    }

    save(answerQuality);
    setAnswer('');
    setRevising(false);
    setCurrent(current + 1);

    // iOS only displays the soft keyboard if an input is focused _in a click event fn_
    if (answerFieldRef.current) {
      answerFieldRef.current.disabled = false; // can't focus before enabled (next render)
      answerFieldRef.current.focus();
    }
  };

  const onButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    revising ? next() : check();
  };

  const onAcceptCorrection = async (event: React.MouseEvent) => {
    event.preventDefault();
    await next(true);
    showFalseNegativeHint && onDismissHint(Hints.learningFalseNegative);
  };

  const hasSpaceForImage = height > 600; // most likely soft keyboard

  return (
    <Container height={height}>
      <LearnProgress count={count} total={items.length} />
      <Header>
        <FlagButton
          flagged={flagged}
          listId={list.id}
          itemId={itemId}
          onDismissHint={showFlagHint && (() => onDismissHint(Hints.learningFlag))}
        />
        <StyledLinkButton onClick={() => goToList(slug)} title="Zurück zur Übersicht">
          <Icon type="cancel" width="20px" />
        </StyledLinkButton>
      </Header>
      <Content height={height}>
        <Prompt hasImage={!!image}>
          {image && (
            <PromptImageContainer hasSpaceForImage={hasSpaceForImage}>
              <PromptImage
                srcSet={`${image.urls.small} 400w, ${image.urls.regular} 1080w`}
                sizes="calc(20vw + 25vh)"
              />
              <ImageCredits>
                <ExtLink
                  href={`${image.user.link}?utm_source=inemit&utm_medium=referral`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {image.user.name}
                </ExtLink>
              </ImageCredits>
            </PromptImageContainer>
          )}
          {prompt}
        </Prompt>
        <Divider reposition={!hasSpaceForImage} />
        <SolutionForm autoComplete="off">
          <SolutionInputContainer>
            <SolutionInput
              id="solution"
              autoCapitalize="none"
              ref={answerFieldRef}
              value={answer}
              disabled={revising}
              correct={revising && isCorrect}
              incorrect={revising && !isCorrect}
              onChange={(e) => setAnswer(e.target.value)}
              onFocus={() => {
                // prevent iOS from pushing content out of view
                setTimeout(() => window.scrollTo({ top: 0 }), 200);
              }}
            />
            {revising && (
              <RevisionIcon correct={isCorrect}>
                <Icon type={isCorrect ? 'ok' : 'deleteInCircle'} />
              </RevisionIcon>
            )}

            {revising && !isCorrect && (
              <CorrectionBubbleContainer>
                {showFalseNegativeHint && (
                  <Hint onDismiss={() => onDismissHint(Hints.learningFalseNegative)}>
                    Du findest, deine Antwort war richtig? Dann klick auf die grüne
                    Korrektur. Sie dient als "Hab ich doch gemeint!"-Knopf.
                  </Hint>
                )}
                <Correction
                  type="button"
                  onClick={onAcceptCorrection}
                  disabled={disableNext}
                  ref={correctionButtonRef}
                >
                  {solution}
                </Correction>
              </CorrectionBubbleContainer>
            )}
            {revising && isCorrect && showRefinementHint(answer, solution) && (
              <CorrectionBubbleContainer>
                <RefinementHint as="div">{solution}</RefinementHint>
              </CorrectionBubbleContainer>
            )}
          </SolutionInputContainer>
          <SolutionButton
            primary
            type="submit"
            disabled={disableNext}
            onClick={onButtonClick}
            ref={submitButtonRef}
          >
            {revising ? (
              <Icon width="16px" type="next" />
            ) : (
              <Icon width="16px" type="done" />
            )}
          </SolutionButton>
        </SolutionForm>
      </Content>
    </Container>
  );
};

const showRefinementHint = (answer: string, solution: string) =>
  answer.toLowerCase().trim() !==
  solution
    .toLowerCase()
    .trim()
    .replaceAll(/[\(\)]/g, ''); // no refinement hint if answer included optional part in brackets

const Container = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  width: 100vw;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  padding: 1rem;
`;

const Header = styled.header`
  padding-top: env(safe-area-inset-top);
  display: flex;
  justify-content: space-between;
`;

const StyledLinkButton = styled.button`
  background: none;
  padding: 0;
  border: none;
  cursor: pointer;
  color: ${({ theme: { colors } }) => colors.grey[75]};

  :hover {
    color: ${({ theme: { colors } }) => colors.grey[50]};
  }
`;

const Content = styled.main<{ height: number }>`
  height: ${({ height }) => height - 72}px; // header 40 + container 2*16
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Prompt = styled.p.attrs({ as: 'div' })<{ hasImage: boolean }>`
  margin: 0 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  font-size: calc(0.75rem + 2vh + 2vw);
  flex-grow: ${({ hasImage }) => (hasImage ? 2 : 1)};
  word-break: break-word; // ohai Safari
  overflow-wrap: anywhere;
`;
const PromptImageContainer = styled.div<{ hasSpaceForImage?: boolean }>`
  line-height: 0;
  ${({ hasSpaceForImage }) =>
    hasSpaceForImage
      ? 'position: relative;'
      : `position: absolute;
         opacity: 0.25;`}
`;
const PromptImage = styled.img`
  max-height: calc(25vw + 20vh);
  max-width: calc(20vw + 25vh);
  box-shadow: 0 8px 32px ${({ theme: { colors } }) => colors.grey[60]};
`;
const ImageCredits = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 1;
  padding: 0.25rem;
  background: rgba(0, 0, 0, 0.5);
  font-size: ${({ theme: { font } }) => font.sizes.xs};
  color: ${({ theme: { colors } }) => colors.grey[10]};

  display: none;
  ${PromptImageContainer}:hover & {
    display: block;
  }
`;

const Divider = styled.hr<{ reposition?: boolean }>`
  width: 100%;
  border: none;
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  margin: 1rem 0;
  position: relative;
  top: ${({ reposition }) => (reposition ? '1rem' : '0')}; // hacky tweaky
`;

const SolutionForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding-bottom: env(safe-area-inset-bottom);
`;
const SolutionInputContainer = styled.div`
  margin-right: 20px;
  position: relative;
`;
const SolutionInput = styled(TextField)<{ incorrect?: boolean; correct?: boolean }>`
  :disabled {
    transition-delay: 0s;
  }

  ${({ correct, theme: { colors } }) =>
    correct
      ? ` color: ${colors.primary[150]};
          border-color: ${colors.primary[100]};
          background-color: ${colors.primary[10]};`
      : ``}

  ${({ incorrect, theme: { colors } }) =>
    incorrect
      ? ` color: ${colors.negative[100]};
          border-color: ${colors.negative[100]};
          text-decoration: line-through;
          background: ${colors.negative[10]};`
      : ``}
`;
const RevisionIcon = styled.div<{ correct: boolean }>`
  position: absolute;
  height: calc(100% - 4px);
  width: 1.5rem;
  right: 0.5rem;
  top: 2px;
  padding: 0 0.125rem;
  display: flex;
  align-items: center;
  color: ${({ correct, theme: { colors } }) =>
    correct ? colors.primary[100] : colors.negative[100]}90;
  background: ${({ correct, theme: { colors } }) =>
    correct ? colors.primary[5] : colors.negative[5]};
  pointer-events: none;
`;
const SolutionButton = styled(Button)`
  width: 60px;

  > svg {
    margin-right: 0;
  }
`;

const CorrectionBubbleContainer = styled.div`
  line-height: 1.125;
  position: absolute;
  text-align: center;
  bottom: 60px;
  left: 0;
  width: 100%;
  box-sizing: border-box;
`;

const Correction = styled.button`
  min-width: 50%;
  max-width: 100%;
  border-radius: 4px;
  padding: 0.5rem;
  overflow-wrap: break-word;
  line-height: 1.25;

  background: ${({ theme: { colors } }) => colors.primary[10]};
  border: 3px solid ${({ theme: { colors } }) => colors.primary[100]};

  font-weight: ${({ theme: { font } }) => font.weights.bold};
  color: ${({ theme: { colors } }) => colors.primary[100]};
  font-size: ${({ theme: { font } }) => font.sizes.sm};

  outline: none;
  cursor: pointer;

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :focus {
    box-shadow: 0 0 10px ${({ theme: { colors } }) => colors.primary[100]};
  }

  /** triangle */
  position: relative;
  ::after,
  ::before {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(0, 0, 0, 0);
  }

  ::after {
    border-top-color: ${({ theme: { colors } }) => colors.primary[10]};
    border-width: 12px;
    margin-left: -12px;
  }
  /** border */
  ::before {
    border-color: rgba(131, 245, 0, 0);
    border-top-color: ${({ theme: { colors } }) => colors.primary[100]};
    border-width: 16px;
    margin-left: -16px;
  }
`;

const RefinementHint = styled(Correction)`
  background: ${({ theme: { colors } }) => colors.grey[95]};
  border: 2px solid ${({ theme: { colors } }) => colors.grey[50]};
  color: ${({ theme: { colors } }) => colors.grey[25]};
  font-weight: ${({ theme: { font } }) => font.weights.light};
  cursor: default;

  ::after {
    border-top-color: ${({ theme: { colors } }) => colors.grey[95]};
  }
  ::before {
    border-top-color: ${({ theme: { colors } }) => colors.grey[50]};
    border-width: 15px;
    margin-left: -15px;
  }
`;
