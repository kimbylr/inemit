import { AnchorHTMLAttributes, FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Link: FC<any> = ({ className, ...props }) => (
  <RouterLink
    className={`text-primary-100 underline hover:text-primary-150 ${className}`}
    {...props}
  />
);

export const ExtLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a className="text-primary-100 underline hover:text-primary-150" {...props} />
);
