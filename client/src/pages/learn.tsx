import React, { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { LearnProgress } from '../components/learn-progress';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { Input } from '../elements/input';
import { Spinner } from '../elements/spinner';
import { Paragraph } from '../elements/typography';
import { evaluateAnswer } from '../helpers/evaluate-answer';
import { useApi } from '../hooks/use-api';
import { useHeight } from '../hooks/use-height';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { LearnItemForLearning } from '../models';

export const Learn: FC = () => {
  const height = useHeight();
  const { slug, goTo } = useRouting();
  const { getLearnItems, reportProgress } = useApi();

  const { lists } = useLists();
  const list = lists.find(list => list.slug === slug);

  const [items, setItems] = useState<LearnItemForLearning[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revising, setRevising] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [count, setCount] = useState({ correct: 0, incorrect: 0 });

  const answerFieldRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const load = async (listId: string) => {
    try {
      const learnItems = await getLearnItems(listId);
      if (learnItems.length === 0) {
        window.alert('Nichts zu lernen :D');
        goTo(slug);
      }
      setItems(learnItems);
    } catch {
      window.alert('Fehler beim laden der Lerninhalte 0_ò');
      goTo(slug);
    }
  };
  useEffect(() => {
    list && load(list.id);
  }, [list]);

  useEffect(() => {
    if (!revising) {
      answerFieldRef.current?.focus();
    }
  }, [revising]);

  // basically autofocus, but run after useHeight (i.e. recalculate height)
  // fixes a glitch on iOS 13 scrolling out of view on focus
  useEffect(() => {
    answerFieldRef.current?.focus();
  }, []);

  if (!list || !items) {
    return (
      <Container height={height}>
        <Header>
          <StyledLink to={`/${slug}`}>
            <Icon type="logo" width="30px" />
          </StyledLink>
        </Header>
        <Content height={height}>
          <Spinner />
        </Content>
      </Container>
    );
  }

  const { prompt, solution, id: itemId } = items[current];

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
      await save(answerQuality);
      goTo(slug);
      return;
    }

    save(answerQuality);
    setAnswer('');
    setRevising(false);
    setCurrent(current + 1);
  };

  const onButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    revising ? next() : check();
  };

  const onAcceptCorrection = (event: React.MouseEvent) => {
    event.preventDefault();
    next(true);
  };

  return (
    <Container height={height}>
      <LearnProgress count={count} total={items.length} />
      <Header>
        <StyledLink to={`/${slug}`}>
          <Icon type="logo" width="30px" />
        </StyledLink>
      </Header>
      <Content height={height}>
        <Prompt>{prompt}</Prompt>
        <Divider />
        <SolutionForm autoComplete="off">
          <SolutionInputContainer>
            <SolutionInput
              id="solution"
              ref={answerFieldRef}
              value={answer}
              disabled={revising}
              correct={revising && isCorrect}
              incorrect={revising && !isCorrect}
              onChange={e => setAnswer(e.target.value)}
              onFocus={() => {
                // hack to remedy iOS shoving content out of view
                // see https://stackoverflow.com/questions/56351216/ios-safari-unwanted-scroll-when-keyboard-is-opened-and-body-scroll-is-disabled
                setTimeout(() => {
                  window.scrollTo({ top: 0 });
                }, 100);
              }}
            />

            {revising && !isCorrect && (
              <Correction>
                <AcceptCorrection type="button" onClick={onAcceptCorrection}>
                  {solution}
                </AcceptCorrection>
              </Correction>
            )}
          </SolutionInputContainer>
          <SolutionButton
            primary
            type="submit"
            onClick={onButtonClick}
            ref={submitButtonRef}
          >
            {revising ? (
              <Icon width="1rem" type="next" />
            ) : (
              <Icon width="1rem" type="done" />
            )}
          </SolutionButton>
        </SolutionForm>
      </Content>
    </Container>
  );
};

const Container = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  padding: 1rem;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  color: ${({ theme: { colors } }) => colors.primary[100]};

  :hover {
    color: ${({ theme: { colors } }) => colors.primary[150]};
  }
`;

const Content = styled.main<{ height: number }>`
  height: ${({ height }) => height - 100}px; /** 82 plus a bit */
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Prompt = styled(Paragraph)`
  margin: 0.5rem 0;
  text-align: center;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
`;

const SolutionForm = styled.form`
  margin: 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;
const SolutionInputContainer = styled.div`
  margin-right: 20px;
  position: relative;
`;
const SolutionInput = styled(Input)<{ incorrect?: boolean; correct?: boolean }>`
  :disabled {
    transition-delay: 0s;
  }

  ${({ correct, theme: { colors } }) =>
    correct
      ? ` color: ${colors.primary[100]};
          border-color: ${colors.primary[100]};
          background-color: ${colors.primary[10]};`
      : ``}

  ${({ incorrect, theme: { colors } }) =>
    incorrect
      ? ` color: ${colors.negative[100]};
          border-color: ${colors.negative[100]};
          text-decoration: line-through;`
      : ``}
`;
const SolutionButton = styled(Button)`
  width: 60px;

  > svg {
    margin-right: 0;
  }
`;

const Correction = styled.div`
  position: absolute;
  text-align: center;
  bottom: 60px;
  left: 0;
  width: 100%;
  box-sizing: border-box;
`;

const AcceptCorrection = styled.button`
  min-width: 50%;
  max-width: 100%;
  border-radius: 4px;
  padding: 0.5rem;
  overflow-wrap: break-word;

  background: ${({ theme: { colors } }) => colors.primary[10]};
  border: 3px solid ${({ theme: { colors } }) => colors.primary[100]};

  font-weight: 600;
  color: ${({ theme: { colors } }) => colors.primary[100]};
  font-size: ${({ theme: { font } }) => font.sizes.sm};

  outline: none;
  cursor: pointer;
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
