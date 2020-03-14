import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { EditListName } from '../compositions/edit-list-name';
import { Button } from '../elements/button';
import { Spinner } from '../elements/spinner';
import { Heading, Paragraph } from '../elements/typography';
import { routes } from '../helpers/api-routes';
import { useRouting } from '../hooks/use-routing';
import { LearnItem, ListWithItems, LoadingStates } from '../models';
import { useStore } from '../store';

export const EditList: FC = () => {
  const [list, setList] = useState<ListWithItems | null>(null);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goTo } = useRouting();
  const { lists } = useStore();

  const fetchList = async () => {
    if (!slug) {
      return;
    }

    let list = lists.find(list => list.slug === slug);

    setState(LoadingStates.loading);

    try {
      if (!list) {
        const res = await fetch(routes.listBySlug(slug));
        list = await res.json();
        if (res.status !== 200 || !list) {
          throw new Error(`Error while getting list by slug: ${res.status}`);
        }
      }

      const res = await fetch(routes.listItems(list.id));
      if (res.status !== 200) {
        throw new Error(`Error while getting list: ${res.status}`);
      }
      const listWithItems: LearnItem[] = await res.json();
      setList({ ...list, items: listWithItems });
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
        <Paragraph>Leider ist etwas schief gelaufen.</Paragraph>
      </>
    );
  }

  if (!list) return null;

  const onNameChanged = (name: string) => {
    setList({ ...list, name });

    // TODO
    // dispatch(
    //   lists.map(storeList => {
    //     if (list.id === storeList.id) {
    //       return { ...storeList, name: listSummary.name };
    //     }

    //     return storeList;
    //   }),
    // );
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
    </>
  );
};

const ChangeName = styled.section`
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  border-bottom: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  padding: 28px 0;
  margin: 28px 0;
`;
