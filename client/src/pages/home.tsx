import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const Home: FC = () => {
  return (
    <div>
      Welcome home!
      <Link to="/test">Test</Link>
    </div>
  );
};
