import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import SectionService from '../../../services/SectionService';
import ProgramService from '../../../services/ProgramService.jsx';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Loader2, X } from 'lucide-react';

function SectionModal({ isOpen, onClose, gradeLevel, category, onSave }) {
  const [newSections, setNewSections] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingSections, setExistingSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [removingSectionId, setRemovingSectionId] = useState(null);

  const fetchExistingSections = useCallback(async () => {
    try {
      const response = await SectionService.getByGradeAndCategory(gradeLevel, category);
      setExistingSections(response);
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Failed to load existing sections");
    }
  }, [gradeLevel, category]);

  useEffect(() => {
    if (isOpen) {
      fetchExistingSections();
    }
  }, [isOpen, fetchExistingSections]);

  const handleAddSectionField = () => {
    setNewSections(prev => [...prev, '']);
  };

  const handleRemoveSectionField = (index) => {
    setNewSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index, value) => {
    setNewSections(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
  };

  const handleUpdateSection = async (sectionId, newName) => {
    if (!newName.trim()) {
      toast.error('Section name cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      await SectionService.update(sectionId, {
        name: newName.trim(),
        code: `INT-${gradeLevel}-${newName.trim()}`,
        year_level: gradeLevel,
        category: 'Intermediate'
      });
      
      // Update local state first for immediate feedback
      setExistingSections(prev => 
        prev.map(section => 
          section.id === sectionId 
            ? { ...section, name: newName.trim() }
            : section
        )
      );
      
      setEditingSection(null);
      toast.success('Section updated successfully');
      
      // Then fetch fresh data
      fetchExistingSections();
      if (onSave) onSave();
    } catch (error) {
      toast.error(error.message || 'Failed to update section');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      setRemovingSectionId(sectionId);
      
      // Get the section first to get its program_id
      const section = existingSections.find(s => s.id === sectionId);
      if (!section) {
        throw new Error('Section not found');
      }

      // Delete the section first
      await SectionService.delete(sectionId);
      
      // Then delete the associated program
      if (section.program_id) {
        await ProgramService.delete(section.program_id);
      }
      
      // Update local state first for immediate feedback
      setExistingSections(prev => prev.filter(s => s.id !== sectionId));
      toast.success('Section and program deleted successfully');
      
      // Then fetch fresh data
      fetchExistingSections();
      if (onSave) onSave();
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error(error.message || 'Failed to delete section');
    } finally {
      setRemovingSectionId(null);
    }
  };

  const handleAddSections = async (e) => {
    e.preventDefault();
    
    // Filter out empty sections
    const sectionsToAdd = newSections.filter(section => section.trim());
    
    if (sectionsToAdd.length === 0) {
      toast.error('Please enter at least one section name');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create a new program for each section
      const promises = sectionsToAdd.map(async (section) => {
        const sectionName = section.trim();
        
        // Create program data for this section
        const programData = {
          name: `Grade ${gradeLevel} - ${sectionName}`,
          code: `INT-${gradeLevel}-${sectionName}`,
          yearLevel: `Grade ${gradeLevel}`,
          category: 'Intermediate',
          section: sectionName
        };

        console.log('Creating program with data:', programData); // Debug log

        try {
          // Create the program (which will also create the section)
          const response = await ProgramService.create(programData);
          
          if (response.program && response.program.sections && response.program.sections.length > 0) {
            return response.program.sections[0];
          } else {
            throw new Error('Section was not created with the program');
          }
        } catch (error) {
          console.error('Error creating program/section:', error);
          throw new Error(error.response?.data?.message || 'Failed to create program and section');
        }
      });

      const results = await Promise.all(promises);
      
      // Update local state first for immediate feedback
      setExistingSections(prev => [...prev, ...results]);
      setNewSections(['']); // Reset to single empty field
      
      toast.success('Sections added successfully');
      
      // Then fetch fresh data
      fetchExistingSections();
      if (onSave) onSave();
    } catch (error) {
      console.error('Error adding sections:', error);
      toast.error(error.message || 'Failed to add sections');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Manage Sections
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Grade {gradeLevel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Sections */}
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Existing Sections
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {existingSections.length === 0 ? (
              <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="text-gray-500 dark:text-gray-400">
                  No sections found for Grade {gradeLevel}
                </div>
              </div>
            ) : (
              existingSections.map((section) => (
                <div key={section.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {editingSection?.id === section.id ? (
                    <div className="flex-1 mr-4">
                      <input
                        type="text"
                        value={editingSection.name}
                        onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-transparent"
                        disabled={isSubmitting}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-900 dark:text-gray-100 flex-1 mr-4">{section.name}</span>
                  )}
                  <div className="flex items-center gap-2">
                    {editingSection?.id === section.id ? (
                      <>
                        <button
                          onClick={() => handleUpdateSection(section.id, editingSection.name)}
                          className="px-2.5 py-1.5 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-lg flex items-center gap-1.5 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <FaPlus className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-2.5 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center gap-1.5 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditSection(section)}
                          disabled={isSubmitting || removingSectionId === section.id}
                          className="px-2.5 py-1.5 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-lg flex items-center gap-1.5 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Section"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          disabled={removingSectionId === section.id}
                          className="px-2.5 py-1.5 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-lg flex items-center gap-1.5 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove Section"
                        >
                          {removingSectionId === section.id ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Removing...</span>
                            </>
                          ) : (
                            <>
                              <FaTrash className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Sections Form */}
        <form onSubmit={handleAddSections} className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Add New Sections
          </h3>
          <div className="space-y-4">
            {newSections.map((section, index) => (
              <div key={index} className="group relative">
                <input
                  type="text"
                  value={section}
                  onChange={(e) => handleSectionChange(index, e.target.value)}
                  placeholder="Enter section name"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl
                    focus:ring-2 focus:ring-[#1F3463] focus:border-transparent
                    placeholder-gray-400 dark:placeholder-gray-500
                    text-gray-900 dark:text-gray-100
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    pr-12"
                  disabled={isSubmitting}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSectionField(index)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              onClick={handleAddSectionField}
              className="w-full px-4 py-3 text-[#1F3463] border border-[#1F3463] rounded-xl hover:bg-[#1F3463]/5 dark:hover:bg-[#1F3463]/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <FaPlus className="w-4 h-4" />
              Add Another Section
            </button>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-[#1F3463] text-white rounded-xl hover:bg-[#172a4d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding Sections...
                </>
              ) : (
                'Add Sections'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SectionModal; 