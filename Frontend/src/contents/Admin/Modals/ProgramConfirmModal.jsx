import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

function ProgramConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;
  
    const handleConfirm = () => {
      onConfirm();
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
  
          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300
                  bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                  rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2.5 text-sm font-medium text-white
                  bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700
                  rounded-xl transition-colors duration-200
                  flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  export default ProgramConfirmModal;
  