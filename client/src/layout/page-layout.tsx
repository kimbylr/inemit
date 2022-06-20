import React, { FC } from 'react';
import styled from 'styled-components';

export const PageLayout: FC<{ width?: 'wide' | 'tight' }> = ({
  children,
  width = 'tight',
}) => (
  <div className={`mx-auto sm:mt-4 ${width === 'wide' ? 'max-w-6xl' : 'max-w-3xl'}`}>
    {children}
  </div>
);
