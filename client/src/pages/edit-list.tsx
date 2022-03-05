import React, { FC, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { EditableItem } from '../components/editable-item';
import { ExpandableArea } from '../components/expandable-area';
import { BatchImport } from '../compositions/batch-import';
import { EditListName } from '../compositions/edit-list-name';
import { EditableItemsList } from '../compositions/editable-items-list';
import { Button, CautionButton } from '../elements/button';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import {
  Heading,
  Paragraph,
  SubHeading,
  SubHeadingUncolored,
  SubSubHeading,
} from '../elements/typography';
import { markDoublets } from '../helpers/mark-doublets';
import { useApi } from '../hooks/use-api';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { LearnItem, LearnItemWithDoublet, LoadingStates } from '../models';

const DELETE_PROMPT = `Gib "JA" ein, um diese Liste unwiderruflich zu löschen.`;

export const EditList: FC = () => {
  const { getItems, deleteList } = useApi();
  const [items, setItems] = useState<LearnItemWithDoublet[]>([]);
  const lastInputRef = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goToList } = useRouting();
  const { lists, state: listsState, updateList, removeList } = useLists();
  const list = lists.find((list) => list.slug === slug);

  const fetchItems = async () => {
    if (!list) {
      return;
    }

    setState(LoadingStates.loading);

    try {
      const items = await getItems(list.id);
      setItems(markDoublets(items));
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

  const onListNameChanged = (name: string) => {
    updateList({ ...list, name });
  };

  const onListDeleted = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (prompt(DELETE_PROMPT) !== 'JA') {
      return;
    }

    try {
      await deleteList(list.id);
      removeList(list.id);
    } catch (error) {
      console.error(error);
    }
  };

  const onItemsAdded = (newItems: LearnItem[]) => {
    setItems((items) => markDoublets([...items, ...newItems]));
  };

  const onItemSaved = (editedItem: LearnItem) => {
    setItems((items) =>
      markDoublets(items.map((item) => (editedItem.id === item.id ? editedItem : item))),
    );
  };

  const onItemDeleted = (id: string) => {
    setItems((items) => markDoublets(items.filter((item) => item.id !== id)));
  };

  const flaggedItems = items.filter(({ flagged }) => flagged);

  return (
    <>
      <Heading>{list.name}</Heading>
      <Paragraph>
        In dieser Liste gibt es <strong>{items.length} Vokabeln</strong>.
      </Paragraph>

      <Paragraph>
        <Button onClick={() => lastInputRef?.current?.focus()}>
          <Icon type="add" width="17px" /> Vokabel hinzufügen …
        </Button>
      </Paragraph>

      <StickyParagraph>
        <Button primary onClick={() => goToList(slug)}>
          <Icon type="done" width="14px" /> bearbeiten abschliessen
        </Button>
      </StickyParagraph>
      <StickyNotchCover />

      <ExpandableArea
        canExpand
        teaserStyles={TeaserStyles}
        teaser={<SubHeadingUncolored>Umbenennen</SubHeadingUncolored>}
      >
        <EditListName
          currentName={list.name}
          listId={list.id}
          onNameChanged={onListNameChanged}
        />
      </ExpandableArea>

      <ExpandableArea
        canExpand
        teaserStyles={TeaserStyles}
        teaser={<SubHeadingUncolored>Liste löschen</SubHeadingUncolored>}
      >
        <CautionButton onClick={onListDeleted}>
          <Icon type="delete" width="14px" /> Liste löschen
        </CautionButton>
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
        <strong>Vokabelpaare selbst eingeben ist sinnvoll investierte Zeit.</strong> Das
        Ausdenken einer Aufgabe verankert das Wort ein erstes Mal. Und es verhindert, dass
        du Lernzeit mit Wörtern vergeudest, die du schon beherrschst.
      </LearnItemsIntro>
      <LearnItemsIntro>Einige Tipps für grösseren Lerneffekt:</LearnItemsIntro>
      <LearnItemsIntroList>
        <li>
          <strong>Kontext</strong>: Am besten funktionieren Aufgaben, die das Lernmaterial
          in einen Kontext stellen, also z.B. in einem Satz oder Ausdruck verwenden.
        </li>
        <li>
          <strong>Bilder</strong> unterstützen den immersiven Effekt.
        </li>
        <li>
          <strong>Synonyme</strong> haben den Vorteil, dass die Verknüpfungen{' '}
          <em>innerhalb</em> der Lernsprache verstärkt werden (und nicht zur
          Muttersprache).
        </li>
      </LearnItemsIntroList>

      {
        /** to be replaced with filtering */
        flaggedItems.length > 0 && (
          <>
            <SubSubHeading>
              Markiert <Icon type="flag" width="16px" />
            </SubSubHeading>
            <LearnItemList>
              {flaggedItems.map((item, index) => (
                <LearnItemListElement key={item.id}>
                  <EditableItem
                    item={item}
                    index={index + 1}
                    listId={list.id}
                    onItemDeleted={onItemDeleted}
                  />
                </LearnItemListElement>
              ))}
            </LearnItemList>
            <Divider />
            <SubSubHeading>Alle</SubSubHeading>
          </>
        )
      }

      <EditableItemsList
        items={items}
        listId={list.id}
        onItemsAdded={onItemsAdded}
        onItemDeleted={onItemDeleted}
        onItemSaved={onItemSaved}
        lastInputRef={lastInputRef}
      />
    </>
  );
};

const StickyParagraph = styled(Paragraph)`
  position: sticky;
  top: env(safe-area-inset-top);
  padding: 0.5rem 0 1rem;
  z-index: 2;
  background: ${({ theme: { colors } }) => colors.grey[98]};
`;

const StickyNotchCover = styled.div`
  position: sticky;
  top: 0;
  content: '';
  height: env(safe-area-inset-top);
  width: 100%;
  background: ${({ theme: { colors } }) => colors.grey[98]};
  z-index: 1;
`;

const TeaserStyles = css`
  width: 100%;
  color: ${({ theme: { colors } }) => colors.primary[150]};

  :hover {
    color: ${({ theme: { colors } }) => colors.primary[100]};
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
const LearnItemListElement = styled.li`
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  padding: 16px 0 4px;
`;

const Divider = styled.hr`
  margin: 1rem 0 2rem;
  border: none;
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
`;
