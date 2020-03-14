import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ProgressBar } from '../components/progress-bar';
import { Button } from '../elements/button';
import { Spinner } from '../elements/spinner';
import { Heading, Paragraph } from '../elements/typography';
import { routes } from '../helpers/api-routes';
import { ListSummary, LoadingStates } from '../models';

export const List: FC = () => {
  const { slug } = useParams();
  const [list, setList] = useState<ListSummary | null>(null);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);

  const fetchList = async () => {
    if (!slug) {
      return;
    }

    try {
      setState(LoadingStates.loading);
      const res = await fetch(routes.listBySlug(slug));
      if (res.status !== 200) {
        throw new Error(`Error: ${res.status}`);
      }
      const listWithItems: ListSummary = await res.json();
      setList(listWithItems);
      setState(LoadingStates.loaded);
    } catch (error) {
      console.error(error);
      setList(null);
      setState(LoadingStates.error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchList();
    }
  }, [slug]);

  if (state === 'loading' || state === 'initial') {
    return <Spinner />;
  }

  if (state === 'error') {
    return (
      <>
        <Heading>¯\_(ツ)_/¯</Heading>
        <Paragraph>Unter dieser Adresse existiert keine Liste.</Paragraph>
      </>
    );
  }

  if (!list || !list.progress) return null;

  const dueToday = list.progress.dueBeforeDays[0];
  const editList = () => {}; // TODO
  const startLearning = () => {}; // TODO

  return (
    <>
      <Heading>{list.name}</Heading>
      {list.itemsCount > 0 && (
        <ProgressBarContainer>
          <ProgressBar stages={list.progress!.stages} />
        </ProgressBarContainer>
      )}
      <Paragraph>
        In dieser Liste gibt es <strong>{list.itemsCount} Vokabeln</strong>.
        Davon sind <strong>{dueToday}</strong> bereit zum lernen.
      </Paragraph>
      <Paragraph>
        {dueToday > 0 && (
          <ButtonWithSpacing primary onClick={startLearning}>
            Jetzt lernen!
          </ButtonWithSpacing>
        )}
        <Button onClick={editList}>bearbeiten</Button>
      </Paragraph>
    </>
  );
};

const ButtonWithSpacing = styled(Button)`
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ProgressBarContainer = styled.div`
  margin: 2rem 0;
`;
