import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ProgressBar } from '../components/progress-bar';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import { Heading, Paragraph } from '../elements/typography';
import { useApi } from '../hooks/use-api';
import { useRouting } from '../hooks/use-routing';
import { ListWithProgress, LoadingStates } from '../models';

export const List: FC = () => {
  const [list, setList] = useState<ListWithProgress | null>(null);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goTo } = useRouting();
  const { getListBySlug } = useApi();

  const fetchList = async () => {
    if (!slug) {
      return;
    }

    setState(LoadingStates.loading);
    try {
      const list = await getListBySlug(slug);
      setList(list);
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

  if (state === 'error' || !list) {
    return (
      <>
        <Heading>¯\_(ツ)_/¯</Heading>
        <Paragraph>Unter dieser Adresse existiert keine Liste.</Paragraph>
      </>
    );
  }

  const dueToday = list.progress.dueBeforeDays[0];
  const editList = () => goTo(list.slug, 'edit');
  const startLearning = () => goTo(list.slug, 'learn');

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
        Davon stehen <strong>{dueToday}</strong> zum Lernen an.
      </Paragraph>
      <Paragraph>
        {dueToday > 0 && (
          <ButtonWithSpacing primary onClick={startLearning}>
            <Icon type="logo" width="14px" />
            Jetzt lernen!
          </ButtonWithSpacing>
        )}
        <Button onClick={editList}>
          <Icon type="edit" width="14px" /> bearbeiten
        </Button>
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
