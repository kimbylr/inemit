import { classNames } from '@/helpers/class-names';
import { FC, ReactNode } from 'react';

type Props = {
  checked: boolean;
  name: string;
  onCheck(): void;
  small?: boolean;
  children: ReactNode;
};

export const RadioButton: FC<Props> = ({ children, checked, onCheck, small }) => (
  <label
    className={classNames(
      'cursor-pointer flex',
      small ? 'text-xxs items-end' : 'text-xs items-start',
    )}
  >
    <div className={classNames('pt-[1px] flex-shrink-0 relative', small ? 'w-5' : 'w-7')}>
      <input className="no-show peer" type="radio" checked={checked} onChange={onCheck} />
      <div
        className={classNames(
          'border-2 rounded-full relative',
          'peer-focus-visible:outline peer-focus-visible:outline-primary-25 peer-focus-visible:outline-offset-2',
          small ? 'h-4 w-4' : 'h-5 w-5',
          checked ? 'border-primary-100 bg-primary-5' : 'border-gray-85 bg-white',
        )}
      >
        {checked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={classNames(
                'bg-primary-100 rounded-full',
                small ? 'w-1 h-1' : 'w-1.5 h-1.5',
              )}
            />
          </div>
        )}
      </div>
    </div>
    <span className="text-black">{children}</span>
  </label>
);
