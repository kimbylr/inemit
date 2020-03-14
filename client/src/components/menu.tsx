import React, { FC, useState } from 'react';
import { Collapse } from 'react-collapse';
import styled from 'styled-components';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import { routes } from '../helpers/api-routes';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { ListSummary } from '../models';

export const Menu: FC = () => {
  const [open, setOpen] = useState(false);
  const { lists, state, storeList } = useLists();
  const { goTo, slug } = useRouting();

  if (state === 'loading' || state === 'initial') {
    return (
      <Container>
        <Title>
          <Spinner small white />
        </Title>
      </Container>
    );
  }

  if (state === 'error') {
    return (
      <Container>
        <ErrorContainer>
          <Title>Habemus Fehler 🙄</Title>
          <OutlineButton onClick={() => window.location.reload()}>
            Neu laden
          </OutlineButton>
        </ErrorContainer>
      </Container>
    );
  }

  const hasLists = lists.length > 0;
  const inactiveLists = lists.filter(list => list.slug !== slug);
  const activeList = slug && lists.find(list => list.slug === slug);

  const selectList = (list: ListSummary) => {
    setOpen(false);
    goTo(list.slug);
  };

  const addList = async () => {
    const name = prompt('Name der neuen Liste:');

    if (!name) {
      return;
    }

    try {
      const res = await fetch(routes.lists(), {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.status !== 200) {
        throw new Error();
      }

      const list: ListSummary = await res.json();
      storeList(list);
      selectList(list);
    } catch {
      console.error('Could not add list'); // TODO
    }
  };

  return (
    <Container>
      <ToggleButton isOpened={open} onClick={() => setOpen(o => !o)}>
        <Title>
          {!hasLists && (
            <OutlineButton onClick={addList}>Neue Liste</OutlineButton>
          )}
          {hasLists && !activeList && 'Liste auswählen...'}
          {hasLists && activeList && activeList.name}
        </Title>
        {hasLists && (
          <ToggleButtonIcon isOpened={open}>
            <Icon type="chevronDown" />
          </ToggleButtonIcon>
        )}
      </ToggleButton>

      <Collapse isOpened={open}>
        {hasLists && (
          <List>
            {inactiveLists.map(list => (
              <ListItem key={list.id}>
                <ListLink as="a" onClick={() => selectList(list)}>
                  {list.name}
                </ListLink>
              </ListItem>
            ))}
            <ListItem>
              <OutlineButton onClick={addList}>Neue Liste</OutlineButton>
            </ListItem>
          </List>
        )}
      </Collapse>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 0.75rem 0 0.5rem;
  background: linear-gradient(
    to bottom,
    ${({ theme: { colors } }) => colors.secondary[50]},
    ${({ theme: { colors } }) => colors.primary[50]}
  );

  position: relative;
  overflow: hidden;
  ::before {
    content: '';
    pointer-events: none;
    position: absolute;
    left: -20px;
    top: 0;
    right: -20px;
    bottom: -20px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 1);
  }

  .ReactCollapse--collapse {
    transition: height 0.2s;
  }

  position: relative;
  :after {
    content: '';
    position: absolute;
    bottom: 0;
    padding: -20px;
    box-shadow: 0px 4px 20px -4px #000000;
    width: 100%;
  }
`;

const ToggleButton = styled.button<{ isOpened: boolean }>`
  outline: none; /* TODO */
  cursor: pointer;
  border: none;
  background: none;
  margin: 0 auto;
  padding: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.25rem;

  color: ${({ theme: { colors } }) => colors.primary[150]};

  :hover {
    color: ${({ theme: { colors } }) => colors.grey[25]};
  }
`;

const Title = styled.h3`
  font-weight: ${({ theme: { font } }) => font.weights.bold};
  font-size: ${({ theme: { font } }) => font.sizes.sm};
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;
const ListItem = styled.li`
  margin: 0.25rem;
  padding: 0;
  text-align: center;
`;
const ListLink = styled(Title)`
  cursor: pointer;
  color: ${({ theme: { colors } }) => colors.primary[150]};

  :hover {
    color: ${({ theme: { colors } }) => colors.grey[25]};
  }
`;
const ToggleButtonIcon = styled.div<{ isOpened: boolean }>`
  margin-left: 0.5rem;
  position: relative;
  width: 30px;
  height: 30px;
  top: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  transform: rotate(${({ isOpened }) => (isOpened ? '-180' : '0')}deg);
  transition: transform 0.2s ease-in-out;
`;

const OutlineButton = styled(Button)`
  color: ${({ theme: { colors } }) => colors.primary[150]};
  border: 1px solid ${({ theme: { colors } }) => colors.primary[150]};
  background: none;
  box-shadow: none;

  :hover:not(:disabled),
  :active {
    color: ${({ theme: { colors } }) => colors.grey[25]};
    border-color: ${({ theme: { colors } }) => colors.grey[25]};
  }

  :active {
    background: none;
    top: 0;
  }
`;

const ErrorContainer = styled.div`
  margin: 0.5rem 0;
  text-align: center;

  > :first-child {
    margin-bottom: 0.5rem;
  }
`;
