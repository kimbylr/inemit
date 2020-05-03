import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import { useAuth } from '../helpers/auth';
import { useApi } from '../hooks/use-api';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { ListSummary } from '../models';
import { ExpandableArea } from './expandable-area';

export const Menu: FC = () => {
  const { user, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { lists, state, storeList } = useLists();
  const { goTo, slug } = useRouting();
  const { addList } = useApi();

  if (!user) {
    return (
      <Container>
        <OutlineButton onClick={() => login()}>Login</OutlineButton>
      </Container>
    );
  }

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

  const selectList = (list: ListSummary, mode?: 'edit') => {
    setOpen(false);
    goTo(list.slug, mode);
  };

  const onAddList = async () => {
    const name = prompt('Name der neuen Liste:');

    if (!name) {
      return;
    }

    try {
      const list = await addList(name);
      storeList(list);
      selectList(list, 'edit');
    } catch {
      console.error('Could not add list'); // TODO
    }
  };

  return (
    <Container>
      <LogoutButtonContainer>
        <OutlineButton onClick={() => logout()}>Logout</OutlineButton>
      </LogoutButtonContainer>

      <ChooseListContainer>
        <ExpandableArea
          canExpand={hasLists}
          state={[open, setOpen]}
          teaserStyles={TeaserStyles}
          teaser={
            <Title>
              {!hasLists && (
                <OutlineButton onClick={onAddList}>
                  <Icon type="addList" width="14px" /> Neue Liste
                </OutlineButton>
              )}
              {hasLists && !activeList && 'Liste auswählen...'}
              {hasLists && activeList && activeList.name}
            </Title>
          }
        >
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
                <OutlineButton onClick={onAddList}>
                  <Icon type="addList" width="14px" /> Neue Liste
                </OutlineButton>
              </ListItem>
            </List>
          )}
        </ExpandableArea>
      </ChooseListContainer>
    </Container>
  );
};

const Container = styled.nav`
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 1rem 0.5rem;

  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;

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
`;

const Title = styled.h3`
  font-weight: ${({ theme: { font } }) => font.weights.bold};
  font-size: ${({ theme: { font } }) => font.sizes.sm};
  text-align: left;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;
const ListItem = styled.li`
  margin: 0.25rem 0;
  padding: 0;
`;
const ListLink = styled(Title)`
  cursor: pointer;
  color: ${({ theme: { colors } }) => colors.primary[150]};

  :hover {
    color: ${({ theme: { colors } }) => colors.grey[25]};
  }
`;

const TeaserStyles = css`
  margin-bottom: 0.25rem;
  color: ${({ theme: { colors } }) => colors.primary[150]};

  :hover {
    color: ${({ theme: { colors } }) => colors.grey[25]};
  }
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

const LoginContainer = styled.div`
  margin: 0.5rem 0;
  text-align: center;
`;

const ErrorContainer = styled(LoginContainer)`
  > :first-child {
    margin-bottom: 0.5rem;
  }
`;

const ChooseListContainer = styled.div`
  margin-top: 0.5rem;
  word-break: break-word;
`;

const LogoutButtonContainer = styled.div`
  margin-left: 1rem;
`;
