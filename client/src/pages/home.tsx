import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div>
      Welcome home!
      <Link to="/test">Test</Link>
    </div>
  );
};
