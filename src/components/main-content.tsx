import React from 'react';

interface MainContentProps {
  title: string;
  children: React.ReactNode;
}

function MainContent({ title, children }: MainContentProps) {
  return (
    <div className='mt-5'>
      <h2 className='font-semibold text-xl mb-3'>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

export default MainContent;
