import React, { useEffect, useState } from 'react';
import Content from '../../components/Content';
import Stats from '../../components/Stats';
import Upcoming from '../../components/Upcoming';

function SDashboard() {

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <Content />
      <Stats />
      <Upcoming />
    </main>
  );
}

export default SDashboard;
