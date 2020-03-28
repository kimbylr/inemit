import React, { FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { ExpandableArea } from '../components/expandable-area';
import { BatchImport } from '../compositions/batch-import';
import { EditListName } from '../compositions/edit-list-name';
import { EditableItem } from '../compositions/editable-item';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import {
  Heading,
  Paragraph,
  StickyParagraph,
  SubHeading,
  SubHeadingUncolored,
} from '../elements/typography';
import { getItems } from '../helpers/api';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { LearnItem, LoadingStates } from '../models';

export const EditList: FC = () => {
  const [items, setItems] = useState<LearnItem[]>([]);
  const [newItemIds, setNewItemIds] = useState<number[]>([1]);
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

  useEffect(() => {
    if (state === 'loaded' && list) {
      // TODO: list could be stale. including it leads to circular updating.
      //–> better state handling needed (e.g. with proper redux actions)
      updateList({ ...list, itemsCount: items.length });
    }
  }, [items.length]);

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

  const onItemsAdded = (newItems: LearnItem[]) => {
    setItems(items => [...items, ...newItems]);
  };

  const onItemDeleted = (id: string) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  const onNewItemEdited = () => {
    setNewItemIds(ids => [...ids, ids[ids.length - 1] + 1]);
  };

  const onNewItemSaved = (item: LearnItem, tempId: string) => {
    setNewItemIds(ids => ids.filter(id => `${id}` !== tempId));
    onItemsAdded([item]);
  };

  const finishEditing = () => {
    // TODO: check if unsaved items, notify
    goTo(slug!);
  };

  return (
    <>
      <Heading>{list.name}</Heading>
      <Paragraph>
        In dieser Liste gibt es <strong>{list.itemsCount} Vokabeln</strong>.
      </Paragraph>

      <StickyParagraph>
        <Button primary onClick={finishEditing}>
          <Icon type="done" width="14px" /> bearbeiten abschliessen
        </Button>
      </StickyParagraph>

      <ExpandableArea
        canExpand
        teaserStyles={TeaserStyles}
        teaser={<SubHeadingUncolored>Umbenennen</SubHeadingUncolored>}
      >
        <EditListName
          currentName={list.name}
          listId={list.id}
          onNameChanged={onNameChanged}
        />
      </ExpandableArea>

      <ExpandableArea
        canExpand
        teaserStyles={TeaserStyles}
        teaser={<SubHeadingUncolored>Import</SubHeadingUncolored>}
      >
        <BatchImportIntro>
          1 Eintrag pro Zeile. Vokabel und Abfrage mit Tabulator trennen.
        </BatchImportIntro>
        <BatchImport listId={list.id} onBatchImportDone={onItemsAdded} />
      </ExpandableArea>

      <SubHeading>Vokabeln</SubHeading>
      <LearnItemList>
        {items.map((item, index) => (
          <LearnItem key={item.id}>
            <EditableItem
              item={item}
              index={index + 1}
              listId={list.id}
              onItemDeleted={onItemDeleted}
            />
          </LearnItem>
        ))}
        {newItemIds.map((id, index) => {
          const item = {
            id: `${id}`,
            prompt: '',
            solution: '',
            isNew: true,
          };

          return (
            <LearnItem key={item.id}>
              <EditableItem
                item={item}
                index={items.length + index + 1}
                listId={list.id}
                onNewItemEdited={onNewItemEdited}
                onNewItemSaved={onNewItemSaved}
              />
            </LearnItem>
          );
        })}
      </LearnItemList>
    </>
  );
};

const TeaserStyles = css`
  width: 100%;
  color: ${({ theme: { colors } }) => colors.primary[100]};

  :hover {
    color: ${({ theme: { colors } }) => colors.primary[150]};
  }
`;

const BatchImportIntro = styled(Paragraph)`
  margin-top: 0;
  font-size: ${({ theme: { font } }) => font.sizes.xs};
`;

const LearnItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const LearnItem = styled.li`
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  padding: 16px 0 4px;
`;
