import { useState } from "react";
import { AlertTriangle } from "lucide-react";

function ProgramConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-800 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramConfirmModal;
