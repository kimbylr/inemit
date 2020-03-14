import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { EditListName } from '../compositions/edit-list-name';
import { Button } from '../elements/button';
import { Spinner } from '../elements/spinner';
import { Heading, Paragraph } from '../elements/typography';
import { routes } from '../helpers/api-routes';
import { useRouting } from '../hooks/use-routing';
import { LearnItem, LoadingStates } from '../models';
import { useLists } from '../hooks/use-lists';

export const EditList: FC = () => {
  const [items, setItems] = useState<LearnItem[]>([]);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goTo } = useRouting();
  const { lists, state: listsState, updateList } = useLists();
  const list = lists.find(list => list.slug === slug);

  const fetchList = async () => {
    if (!slug || !list) {
      return;
    }

    setState(LoadingStates.loading);

    try {
      const res = await fetch(routes.listItems(list.id));
      if (res.status !== 200) {
        throw new Error(`Error while getting list: ${res.status}`);
      }
      const items: LearnItem[] = await res.json();
      setItems(items);
      setState(LoadingStates.loaded);
    } catch (error) {
      console.error(error);
      setState(LoadingStates.error);
    }
  };

  useEffect(() => {
    if (slug && listsState === 'loaded') {
      fetchList();
    }
  }, [slug, listsState]);

  if (state === 'loading' || state === 'initial') {
    return <Spinner />;
  }

  if (state === 'error' || !list) {
    return (
      <>
        <Heading>¯\_(ツ)_/¯</Heading>
        <Paragraph>Leider ist etwas schief gelaufen.</Paragraph>
      </>
    );
  }

  const onNameChanged = (name: string) => {
    updateList({ ...list, name });
  };

  const finishEditList = () => goTo(slug!);

  return (
    <>
      <Heading>{list.name}</Heading>
      <Paragraph>
        In dieser Liste gibt es <strong>{list.itemsCount} Vokabeln</strong>.
      </Paragraph>

      <ChangeName>
        <EditListName
          currentName={list.name}
          listId={list.id}
          onNameChanged={onNameChanged}
        />
      </ChangeName>

      <Paragraph>
        scrollen -> position fixed, top 0
        <Button primary onClick={finishEditList}>
          fertig
        </Button>
      </Paragraph>

      {items.map(item => (
        <div>
          {item.prompt}: {item.solution}
        </div>
      ))}
    </>
  );
};

const ChangeName = styled.section`
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  border-bottom: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  padding: 28px 0;
  margin: 28px 0;
`;
