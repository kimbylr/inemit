import React, { FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { ExpandableArea } from '../components/expandable-area';
import { BatchImport } from '../compositions/batch-import';
import { EditListName } from '../compositions/edit-list-name';
import { EditableItem } from '../compositions/editable-item';
import { Button, CautionButton } from '../elements/button';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import {
  Heading,
  Paragraph,
  StickyParagraph,
  SubHeading,
  SubHeadingUncolored,
} from '../elements/typography';
import { useApi } from '../hooks/use-api';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { LearnItem, LoadingStates } from '../models';

const DELETE_PROMPT = `Gib "JA" ein, um diese Liste unwiderruflich zu löschen.`;

export const EditList: FC = () => {
  const { getItems, deleteList } = useApi();
  const [items, setItems] = useState<LearnItem[]>([]);
  const [newItemIds, setNewItemIds] = useState<number[]>([1]);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goTo } = useRouting();
  const { lists, state: listsState, updateList, removeList } = useLists();
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

  const onDeleteList = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (prompt(DELETE_PROMPT) !== 'JA') {
      return;
    }

    try {
      await deleteList(list.id);
      removeList(list.id);
      goTo();
    } catch (error) {
      console.error(error);
    }
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

      <Paragraph>
        <CautionButton onClick={onDeleteList}>
          <Icon type="delete" width="14px" /> Liste löschen
        </CautionButton>
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
      <LearnItemsIntro>
        <strong>
          Vokabelpaare selbst eingeben ist sinnvoll investierte Zeit.
        </strong>{' '}
        Das Ausdenken einer Aufgabe verankert das Wort ein erstes Mal. Und es
        verhindert, dass man Lernzeit mit Wörtern vergeudet, die man schon
        beherrscht.
      </LearnItemsIntro>
      <LearnItemsIntro>Einige Tipps für grösseren Lerneffekt:</LearnItemsIntro>
      <LearnItemsIntroList>
        <li>
          <strong>Kontext</strong>: Am besten funktionieren Aufgaben, die das
          Lernmaterial in einen Kontext stellen, z.B. einen Satz oder Ausdruck.
        </li>
        <li>
          <strong>Bilder</strong> unterstützen den immersiven Effekt.
        </li>
        <li>
          <strong>Synonyme</strong> haben den Vorteil, dass die Verknüpfungen
          <em>innerhalb</em> der Sprache verstärkt werden (und nicht zur
          Muttersprache).
        </li>
      </LearnItemsIntroList>
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

const LearnItemsIntro = styled(Paragraph)`
  font-size: ${({ theme: { font } }) => font.sizes.xs};
`;
const LearnItemsIntroList = styled.ul`
  margin: 0 0 2rem;
  padding: 0 0 0 1rem;

  li {
    padding-bottom: 0.5rem;
    line-height: 1.4;

    strong {
      font-weight: 600;
      color: ${({ theme: { colors } }) => colors.grey[25]};
    }
  }
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
