import React from 'react';
import Content from '../../components/Content';
import Stats from '../../components/Stats';
import Upcoming from '../../components/Upcoming';

function SDashboard() {
  return (
    <main className='p-4'>
      <Content />
      <Stats />
      <Upcoming />
    </main>
  );
}

export default SDashboard;
