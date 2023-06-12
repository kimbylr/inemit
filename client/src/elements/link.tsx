import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Link: FC<any> = (props) => (
  <RouterLink className="text-primary-100 underline hover:text-primary-150" {...props} />
);

export const ExtLink: FC<any> = (props) => (
  <a className="text-primary-100 underline hover:text-primary-150" {...props} />
);
