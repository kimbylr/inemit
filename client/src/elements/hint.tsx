import { Children, FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from './button';

interface Props {
  children: ReactNode;
  triangle?: boolean;
  position?: 'top' | 'bottom';
  onDismiss: () => void;
}
export const Hint: FC<Props> = ({ children, onDismiss, triangle, position = 'top' }) => (
  <Container>
    <Bubble triangle={triangle} position={position}>
      {Children.map(children, (paragraph, i) => (
        <SmallParagraph key={i}>{paragraph}</SmallParagraph>
      ))}
      <p className="text-center" key="dismiss">
        <Button small type="button" onClick={onDismiss}>
          Alles klar
        </Button>
      </p>
    </Bubble>
  </Container>
);

const Container = styled.div`
  max-width: 500px;
  position: absolute;
  top: -14px; // 2px more than triangle
  height: 0;
  left: 0;
  right: 0;
`;

const Bubble = styled.div<{ triangle?: boolean; position: 'top' | 'bottom' }>`
  position: absolute;
  ${({ position }) => (position === 'bottom' ? 'top: 50px' : 'bottom: 0')};
  left: 0;
  right: 0;

  padding: 0 0.75rem;
  background: ${({ theme: { colors } }) => colors.orange[20]};
  border: 3px solid ${({ theme: { colors } }) => colors.orange[100]};
  border-radius: 1rem;
  text-transform: none;

  /** triangle */
  ${({ triangle, theme: { colors } }) =>
    triangle
      ? `
  ::after,
  ::before {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(0, 0, 0, 0);
  }

  ::after {
    border-top-color: ${colors.orange[20]};
    border-width: 12px;
    margin-left: -12px;
  }
  /** border */
  ::before {
    border-color: rgba(131, 245, 0, 0);
    border-top-color: ${colors.orange[100]};
    border-width: 16px;
    margin-left: -16px;
  }
  `
      : ''}
`;

const SmallParagraph = styled.p`
  font-size: ${({ theme: { font } }) => font.sizes.xxs};

  em {
    color: ${({ theme: { colors } }) => colors.grey[25]};
    font-weight: ${({ theme: { font } }) => font.weights.bold};
  }
`;
