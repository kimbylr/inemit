import { Children, FC, ReactNode } from 'react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  triangle?: boolean;
  position?: 'top' | 'bottom';
  onDismiss: () => void;
}
export const Hint: FC<Props> = ({ children, onDismiss, triangle, position = 'top' }) => (
  <div className="max-w-lg absolute -top-3.5 h-0 left-0 right-0">
    <div
      className={`absolute z-20 left-0 right-0 ${
        position === 'bottom' ? 'top-[50px]' : 'bottom-0'
      } p-3 bg-orange-20 border-[3px] border-orange-100 rounded-lg ${
        triangle ? triangleClasses : ''
      }`}
    >
      {Children.map(children, (paragraph, i) => (
        <p className="text-xxs hint my-1" key={i}>
          {paragraph}
        </p>
      ))}
      <p className="text-center" key="dismiss">
        <Button small type="button" onClick={onDismiss}>
          Alles klar
        </Button>
      </p>
    </div>
  </div>
);

const triangleClasses =
  'after:border-t-orange-20 after:border-[12px] after:-ml-3 ' +
  'before:border-[rgba(131,245,0,0)] before:border-t-orange-100 before:border-[16px] before:-ml-4 ' +
  "before:top-[100%] before:left-[50%] before:border-[transparent] before:content-[''] before:h-0 before:w-0 before:absolute before:pointer-events-none before:border-[rbga(0,0,0,0)] " +
  "after:top-[100%] after:left-[50%] after:border-[transparent] after:content-[''] after:h-0 after:w-0 after:absolute after:pointer-events-none after:border-[rbga(0,0,0,0)]";
