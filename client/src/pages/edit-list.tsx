import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BatchImport } from '../compositions/batch-import';
import { EditListName } from '../compositions/edit-list-name';
import { Button } from '../elements/button';
import { Spinner } from '../elements/spinner';
import { Heading, Paragraph, SubHeading } from '../elements/typography';
import { getItems } from '../helpers/api';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { LearnItem, LoadingStates } from '../models';

export const EditList: FC = () => {
  const [items, setItems] = useState<LearnItem[]>([]);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goTo } = useRouting();
  const { lists, state: listsState, updateList } = useLists();
  const list = lists.find(list => list.slug === slug);

  const fetchItems = async () => {
    if (!list) {
      return;
    }

    setState(LoadingStates.loading);

    try {
      const items = await getItems(list.id);
      setItems(items);
      setState(LoadingStates.loaded);
    } catch (error) {
      console.error(error);
      setState(LoadingStates.error);
    }
  };

  useEffect(() => {
    if (slug && listsState === 'loaded') {
      fetchItems();
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

  const onBatchImportDone = (newItems: LearnItem[]) => {
    const itemsCombined = [...items, ...newItems];
    setItems(itemsCombined);
    updateList({ ...list, itemsCount: itemsCombined.length });
  };

  const finishEditList = () => goTo(slug!);

  return (
    <>
      <Heading>{list.name}</Heading>
      <Paragraph>
        In dieser Liste gibt es <strong>{list.itemsCount} Vokabeln</strong>.
      </Paragraph>
      <Paragraph>&lt;- Zurück zur Übersicht</Paragraph>

      <SubHeading>Name ändern</SubHeading>
      <EditListName
        currentName={list.name}
        listId={list.id}
        onNameChanged={onNameChanged}
      />

      <SubHeading>Serienimport</SubHeading>
      <Paragraph>
        1 Eintrag pro Zeile. Vokabel und Abfrage mit Tabulator trennen.
      </Paragraph>
      <BatchImport listId={list.id} onBatchImportDone={onBatchImportDone} />

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

const Yolo = styled.section`
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  border-bottom: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  padding: 28px 0;
  margin: 28px 0;
`;
