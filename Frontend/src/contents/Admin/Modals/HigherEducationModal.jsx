import BaseModal from "./BaseModal";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function HigherEducationModal({
  isOpen,
  onClose,
  onSave,
  isEditing,
  program,
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    yearLevel: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading state for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      if (isEditing && program) {
        setFormData({
          name: program.name || "",
          code: program.code || "",
          yearLevel: program.yearLevel || "",
        });
      } else {
        setFormData({ name: "", code: "", yearLevel: "" });
      }

      return () => clearTimeout(timer);
    }
  }, [isOpen, isEditing, program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const programData = {
        name: formData.name,
        code: formData.code,
        yearLevel: formData.yearLevel,
        category: "Higher Education",
      };

      await onSave(programData, isEditing, program?.id);
      onClose();
    } catch (error) {
      console.error("Error saving program:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative"
      >
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-12 h-12 border-4 border-[#1F3463] border-t-transparent rounded-full"
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {isEditing ? "Loading program details..." : "Preparing form..."}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Higher Education Program" : "Add Higher Education Program"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading || isSubmitting}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Program Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Program Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter program name"
                disabled={isLoading || isSubmitting}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl
                  focus:ring-2 focus:ring-[#1F3463] focus:border-transparent
                  placeholder-gray-400 dark:placeholder-gray-500
                  text-gray-900 dark:text-gray-100
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Program Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Program Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter program code"
                disabled={isLoading || isSubmitting}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl
                  focus:ring-2 focus:ring-[#1F3463] focus:border-transparent
                  placeholder-gray-400 dark:placeholder-gray-500
                  text-gray-900 dark:text-gray-100
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Year Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Year Level
              </label>
              <select
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleChange}
                disabled={isLoading || isSubmitting}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl
                  focus:ring-2 focus:ring-[#1F3463] focus:border-transparent
                  text-gray-900 dark:text-gray-100
                  transition-all duration-200
                  hover:border-[#1F3463] dark:hover:border-[#1F3463]
                  cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed
                  [&>option]:bg-white [&>option]:dark:bg-gray-700
                  [&>option]:text-gray-900 [&>option]:dark:text-gray-100
                  [&>option:hover]:bg-[#1F3463] [&>option:hover]:text-white
                  [&>option:checked]:bg-[#1F3463] [&>option:checked]:text-white"
                required
              >
                <option value="">Select Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="All Years">All Years (1st–4th)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300
                bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                rounded-xl transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-white
                bg-[#1F3463] hover:bg-[#172a4d]
                rounded-xl transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </>
              ) : (
                isEditing ? "Update Program" : "Add Program"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
