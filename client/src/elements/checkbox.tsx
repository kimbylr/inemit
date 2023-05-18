import { FC, ReactNode } from 'react';
import { Icon } from './icon';

type Props = {
  checked: boolean;
  onCheck(): void;
  small?: boolean;
  children: ReactNode;
};

export const Checkbox: FC<Props> = ({ children, checked, onCheck, small }) => (
  <label
    className={`cursor-pointer flex dotted-focus ${
      small ? 'text-xxs items-end' : 'text-xs items-start'
    }  `}
  >
    <input className="no-show " type="checkbox" checked={checked} onChange={onCheck} />
    <div className={`pt-[1px] flex-shrink-0 relative ${small ? 'w-5' : 'w-7'}`}>
      <div
        className={`border-2 rounded-sm  ${small ? 'h-4 w-4' : 'h-5 w-5'} ${
          checked ? 'border-primary-100 bg-primary-100' : 'border-grey-85 bg-white'
        }`}
      />
      {checked && <CheckIcon small={small} />}
    </div>
    <span className="text-grey-10">{children}</span>
  </label>
);

const CheckIcon: FC<{ small?: boolean }> = ({ small }) => (
  <div
    className={`absolute top-0.5 left-0.5 pointer-events-none text-white ${
      small ? 'h-3 w-3' : 'h-4 w-4'
    }`}
  >
    <Icon type="done" />
  </div>
);
