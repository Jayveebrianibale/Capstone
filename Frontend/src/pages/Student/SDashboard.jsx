import React from 'react';
import Content from '../../components/Content';
import Upcoming from '../../components/Upcoming';

function SDashboard() {
  return (
    <main className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Content />
      <Upcoming />
    </main>
  );
}

export default SDashboard;
