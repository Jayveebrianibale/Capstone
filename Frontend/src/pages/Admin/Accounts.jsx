import React from 'react';
import { Ban } from 'lucide-react';

function Accounts() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white dark:bg-gray-900">
      <Ban className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Not Available Yet
      </h2>
      <p className="text-gray-500 dark:text-gray-400">Accounts feature is coming soon!</p>
    </div>
  );
}

export default Accounts;
