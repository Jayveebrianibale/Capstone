import { useState, useEffect } from "react";
import { X, User, Mail } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function InstructorModal({
  isOpen,
  onClose,
  onSave,
  isEditing,
  instructor,
}) {
  const [formDataList, setFormDataList] = useState([{ name: "", email: "" }]);
  const [isSaving, setIsSaving] = useState(false);
  const primaryColor = "#1F3463";
  const hoverColor = "#172a4d";

  useEffect(() => {
    if (isEditing && instructor) {
      setFormDataList([{ name: instructor.name || "", email: instructor.email || "" }]);
    } else {
      setFormDataList([{ name: "", email: "" }]);
    }
  }, [isEditing, instructor, isOpen]);

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    setFormDataList(prevList => {
      const updated = [...prevList];
      if (name === "email") {
        // Auto-fill name if empty
        if (!updated[idx].name.trim()) {
          const username = value.split("@")[0];
          const nameParts = username
            .split(/[._-]/)
            .filter(Boolean)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
          updated[idx] = { ...updated[idx], email: value.trimStart(), name: nameParts.join(" ").replace(/ +/g, " ") };
          return updated;
        }
      }
      updated[idx] = { ...updated[idx], [name]: value.trimStart() };
      return updated;
    });
  };

  const handleAddRow = () => {
    setFormDataList(prev => [...prev, { name: "", email: "" }]);
  };

  const handleRemoveRow = (idx) => {
    setFormDataList(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    for (const formData of formDataList) {
      if (!formData.name.trim() || !formData.email.trim()) {
        toast.warn("Please fill out all fields for every instructor.");
        return;
      }
    }
  
    setIsSaving(true);
    try {
      let responses = [];
  
      if (isEditing && instructor?.id) {
        // Update one instructor
        const response = await api.put(`/instructors/${instructor.id}`, formDataList[0]);
        responses.push(response.data);
      } else {
        // Create multiple instructors
        for (const formData of formDataList) {
          const response = await api.post("/instructors", formData);
          responses.push(response.data);
        }
      }
  
      toast.success(`Instructor${formDataList.length > 1 ? 's' : ''} ${isEditing ? 'updated' : 'added'} successfully!`);
      onSave(responses);
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(error.response?.data?.message || "Failed to save instructor(s).");
    } finally {
      setIsSaving(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEditing ? "Edit Instructor" : "New Instructor(s)"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? "Update instructor details" : "Add one or more instructors to the system"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {formDataList.map((formData, idx) => (
            <div key={idx} className="space-y-4 border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
              {/* Name Input Header with Remove Icon */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                {formDataList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Remove Instructor"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {/* Name Input */}
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={e => handleChange(e, idx)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all"
                  required
                />
              </div>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={e => handleChange(e, idx)}
                    placeholder="john.doe@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          {!isEditing && (
            <button type="button" onClick={handleAddRow} className="w-full py-2.5 bg-transparent border border-[#1F3463] dark:border-gray-600 text-[#1F3463] dark:text-blue-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-2 font-semibold flex items-center justify-center gap-2">
              + Add Another Instructor
            </button>
          )}
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-5 py-2.5 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isSaving 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : `bg-[${primaryColor}] hover:bg-[${hoverColor}]`
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>{isEditing ? "Update" : "Save"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}