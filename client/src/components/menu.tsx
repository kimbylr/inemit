import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '../elements/icon';
import { Collapse } from 'react-collapse';

export const Menu = () => {
  const [open, toggle] = useState(false);

  return (
    <Container>
      <ToggleButton isOpened={open} onClick={() => toggle(o => !o)}>
        <Title>jtalänisch</Title>
        <ToggleButtonIcon isOpened={open}>
          <Icon type="chevronDown" />
        </ToggleButtonIcon>
      </ToggleButton>

      <Collapse isOpened={open}>
        <List>
          <ListItem>
            <ListLink as="a">schwedisch</ListLink>
          </ListItem>
          <ListItem>
            <ListLink as="a">englisch</ListLink>
          </ListItem>
          <ListItem>
            <ListLink as="a">
              <em>+ neu...</em>
            </ListLink>
          </ListItem>
        </List>
      </Collapse>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 0.5rem 0;
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
    bottom: -10px;
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
