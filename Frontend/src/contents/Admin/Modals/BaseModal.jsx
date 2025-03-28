import { X } from "lucide-react";

export default function BaseModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-[500px] max-w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-gray-600 dark:text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
