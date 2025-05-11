import React from "react";

function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Confirm Logout</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">Are you sure you want to log out of your account?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-800"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
