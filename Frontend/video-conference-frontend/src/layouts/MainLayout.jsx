import React from 'react';
import AIChatWidget from '../components/AIChatWidget';

const MainLayout = ({ children }) => {
  return (
    <>
      {children}
      <AIChatWidget />
    </>
  );
};

export default MainLayout;