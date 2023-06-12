import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../elements/icon';

export const Header: FC = () => (
  <div
    className="w-full bg-gradient-to-b from-primary-100 to-primary-150 select-none flex justify-center"
    style={{ padding: 'max(env(safe-area-inset-top), 0.5rem) 0 0.5rem' }}
  >
    <Link to="/" className="text-grey-98 leading-none my-1 flex justify-center dotted-focus">
      <Icon type="logo" width="40px" />
      <span className="font-massive text-xxl ml-4">inemit!</span>
    </Link>
  </div>
);
