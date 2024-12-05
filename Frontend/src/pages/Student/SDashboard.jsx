import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Content from '../../components/Content';
import Stats from '../../components/Stats';
import Upcoming from '../../components/Upcoming';

function SDashboard() {
  const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div className="relative min-h-screen flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-grow">
        <Navbar />
        <main className='p-4'>
          <Content />
          <Stats />
          <Upcoming />
        </main>
      </div>
    </div>
  );
}

export default SDashboard;
