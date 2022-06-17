import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { EditableItem } from '../components/editable-item';
import { ExpandableArea } from '../components/expandable-area';
import { ProgressBar } from '../components/progress-bar';
import { ProgressPie } from '../components/progress-pie';
import { EditableItemsList } from '../compositions/editable-items-list';
import { Button } from '../elements/button';
import { DueDaysSummary } from '../elements/due-days-summary';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import { Heading, Paragraph, SubHeading } from '../elements/typography';
import { useApi } from '../hooks/use-api';
import { useRouting } from '../hooks/use-routing';
import { MenuLayout } from '../layout/menu-layout';
import {
  LearnItem,
  LearnItemWithDoublet,
  ListWithProgress,
  LoadingStates,
} from '../models';

export const List: FC = () => {
  const [list, setList] = useState<ListWithProgress | null>(null);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goToList } = useRouting();
  const { getListBySlug } = useApi();
  const [items, setItems] = useState<LearnItemWithDoublet[]>([]);

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
    return (
      <MenuLayout>
        <Spinner />
      </MenuLayout>
    );
  }

  if (state === 'error' || !list) {
    return (
      <MenuLayout>
        <Heading>¯\_(ツ)_/¯</Heading>
        <Paragraph>Unter dieser Adresse existiert keine Liste.</Paragraph>
      </MenuLayout>
    );
  }

  const onItemsAdded = (newItems: LearnItem[]) => {
    setItems((items) => [...items, ...newItems]);
    setList((list) =>
      list ? { ...list, itemsCount: list.itemsCount + newItems.length } : null,
    );
  };

  const onItemSaved = (editedItem: LearnItem) => {
    setItems((items) =>
      items.map((item) => (editedItem.id === item.id ? editedItem : item)),
    );
  };

  const onItemDeleted = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
    setList((list) => (list ? { ...list, itemsCount: list.itemsCount - 1 } : null));
  };

  const onFlaggedItemDeleted = (id: string) => {
    setList((list) =>
      list
        ? {
            ...list,
            itemsCount: list.itemsCount - 1,
            flaggedItems: list.flaggedItems.filter((item) => item.id !== id),
          }
        : null,
    );
  };

  const { dueToday, dueTomorrow } = list.progress;
  const editList = () => goToList(list.slug, 'edit');
  const startLearning = () => goToList(list.slug, 'learn');

  return (
    <MenuLayout withPageLayout>
      <Heading>{list.name}</Heading>
      {list.itemsCount > 0 && (
        <>
          <ProgressContainerDesktop>
            <ProgressBar stages={list.progress!.stages} showCountOnClick />
          </ProgressContainerDesktop>

          <ProgressContainerMobile>
            <ExpandableArea
              teaser={<ProgressPie stages={list.progress!.stages} />}
              showChevronButton={false}
            >
              <CountPerStageBarContainer>
                <ProgressBar stages={list.progress!.stages} showCountPerStage />
              </CountPerStageBarContainer>
            </ExpandableArea>
          </ProgressContainerMobile>
        </>
      )}
      <Paragraph>
        In dieser Liste {items.length === 1 ? 'befindet' : 'befinden'} sich{' '}
        <strong>
          {items.length} {items.length === 1 ? 'Vokabel' : 'Vokabeln'}
        </strong>
        . <DueDaysSummary dueToday={dueToday} dueTomorrow={dueTomorrow} />
      </Paragraph>
      <Paragraph>
        {dueToday > 0 && (
          <ButtonWithSpacing primary onClick={startLearning}>
            <Icon type="logo" width="18px" />
            Jetzt lernen!
          </ButtonWithSpacing>
        )}
        <Button onClick={editList}>
          <Icon type="edit" width="14px" /> bearbeiten
        </Button>
      </Paragraph>

      {list.flaggedItems.length > 0 && (
        <ListParagraph>
          <SubHeading>
            Markiert <Icon type="flag" width="16px" />
          </SubHeading>
          <LearnItemList>
            {list.flaggedItems.map((item, index) => (
              <LearnItemListElement key={item.id}>
                <EditableItem
                  item={item}
                  index={index + 1}
                  listId={list.id}
                  onItemDeleted={onFlaggedItemDeleted}
                />
              </LearnItemListElement>
            ))}
          </LearnItemList>
        </ListParagraph>
      )}

      <ListParagraph>
        <SubHeading>Hinzufügen</SubHeading>
        <EditableItemsList
          items={items}
          listId={list.id}
          onItemsAdded={onItemsAdded}
          onItemDeleted={onItemDeleted}
          onItemSaved={onItemSaved}
        />
      </ListParagraph>
    </MenuLayout>
  );
};

const CountPerStageBarContainer = styled.div`
  padding-top: 0.5rem;
`;

const ButtonWithSpacing = styled(Button)`
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ProgressContainerMobile = styled.div`
  margin-top: 1rem;

  @media (min-width: 480.02px) {
    display: none;
  }
`;

const ProgressContainerDesktop = styled.div`
  margin-top: 2rem;

  @media (max-width: 480px) {
    display: none;
  }
`;

const ListParagraph = styled.div`
  margin-top: 3rem;
`;
const LearnItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const LearnItemListElement = styled.li`
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  padding: 16px 0 4px;

  :last-child {
    border-bottom: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  }
`;
