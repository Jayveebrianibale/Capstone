import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { FaPlus } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

export default function IntermediateModal({ isOpen, onClose, onSave, isEditing, program }) {
  const [formData, setFormData] = useState({
    entries: [{
      gradeLevel: "",
      sections: ['']
    }]
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
        // Parse existing data from program name
        const existingEntries = program.name.split('; ').map(entry => {
          const [gradeLevel, ...sections] = entry.split(' - ');
          return {
            gradeLevel: gradeLevel.trim(),
            sections: sections.length > 0 ? sections : ['']
          };
        });
        setFormData({
          entries: existingEntries.length > 0 ? existingEntries : [{ gradeLevel: "", sections: [''] }]
        });
      } else {
        setFormData({
          entries: [{ gradeLevel: "", sections: [''] }]
        });
      }

      return () => clearTimeout(timer);
    }
  }, [isOpen, isEditing, program]);

  const handleGradeLevelChange = (index, value) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index].gradeLevel = value;
    setFormData(prev => ({
      ...prev,
      entries: updatedEntries
    }));
  };

  const handleAddEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { gradeLevel: "", sections: [''] }]
    }));
  };

  const handleRemoveEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.filter((_, i) => i !== index)
    }));
  };

  const handleAddSection = (entryIndex) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[entryIndex].sections.push('');
    setFormData(prev => ({
      ...prev,
      entries: updatedEntries
    }));
  };

  const handleRemoveSection = (entryIndex, sectionIndex) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[entryIndex].sections = updatedEntries[entryIndex].sections.filter((_, i) => i !== sectionIndex);
    setFormData(prev => ({
      ...prev,
      entries: updatedEntries
    }));
  };

  const handleSectionChange = (entryIndex, sectionIndex, value) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[entryIndex].sections[sectionIndex] = value;
    setFormData(prev => ({
      ...prev,
      entries: updatedEntries
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all entries
      for (const entry of formData.entries) {
        if (!entry.gradeLevel) {
          toast.warning("Please select a grade level for all entries.");
          return;
        }

        const sectionsToAdd = entry.sections.filter(section => section.trim());
        if (sectionsToAdd.length === 0) {
          toast.warning("Please enter at least one section for each grade level.");
          return;
        }
      }

      // Create separate program entries for each section
      const programEntries = formData.entries.flatMap(entry => {
        const sectionsToAdd = entry.sections.filter(section => section.trim());
        return sectionsToAdd.map(section => ({
          name: `${entry.gradeLevel} - ${section}`,
          code: "INT",
          category: "INT",
          yearLevel: entry.gradeLevel,
          entries: [{
            gradeLevel: entry.gradeLevel,
            sections: [section]
          }]
        }));
      });

      // Save each program entry separately
      for (const programData of programEntries) {
        await onSave(programData, isEditing, program?.id);
      }

      onClose();
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error("Failed to save program.");
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
            {isEditing ? "Edit Intermediate" : "Add Intermediate"}
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
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {formData.entries.map((entry, entryIndex) => (
              <div key={entryIndex} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Entry {entryIndex + 1}
                  </h3>
                  {entryIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(entryIndex)}
                      className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                      disabled={isLoading || isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Grade Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Grade Level
                  </label>
                  <select
                    value={entry.gradeLevel}
                    onChange={(e) => handleGradeLevelChange(entryIndex, e.target.value)}
                    disabled={isLoading || isSubmitting}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl
                      focus:ring-2 focus:ring-[#1F3463] focus:border-transparent
                      text-gray-900 dark:text-gray-100
                      transition-all duration-200
                      hover:border-[#1F3463] dark:hover:border-[#1F3463]
                      cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select grade level</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                  </select>
                </div>

                {/* Sections */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sections
                  </label>
                  <div className="space-y-3">
                    {entry.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="group relative">
                        <input
                          type="text"
                          value={section}
                          onChange={(e) => handleSectionChange(entryIndex, sectionIndex, e.target.value)}
                          placeholder="Enter Section Name"
                          disabled={isLoading || isSubmitting}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl
                            focus:ring-2 focus:ring-[#1F3463] focus:border-transparent
                            placeholder-gray-400 dark:placeholder-gray-500
                            text-gray-900 dark:text-gray-100
                            transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                            pr-12"
                        />
                        {sectionIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(entryIndex, sectionIndex)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                            disabled={isLoading || isSubmitting}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {!isEditing && (
              <button
                type="button"
                onClick={handleAddEntry}
                className="w-full px-4 py-3 text-[#1F3463] border border-[#1F3463] rounded-xl hover:bg-[#1F3463]/5 dark:hover:bg-[#1F3463]/10 transition-colors flex items-center justify-center gap-2"
                disabled={isLoading || isSubmitting}
              >
                <FaPlus className="w-4 h-4" />
                Add Another Grade Level
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full px-4 py-3 bg-[#1F3463] text-white rounded-xl hover:bg-[#172a4d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditing ? "Updating Program..." : "Adding Program..."}
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
