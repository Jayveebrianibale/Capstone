import { useState, useEffect } from "react";
import { X, User, Mail } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function InstructorModal({
  isOpen,
  onClose,
  onSave,
  isEditing,
  instructor,
}) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);
  const primaryColor = "#1F3463";
  const hoverColor = "#172a4d";

  useEffect(() => {
    if (isEditing && instructor) {
      setFormData({
        name: instructor.name || "",
        email: instructor.email || "",
      });
    } else {
      setFormData({ name: "", email: "" });
    }
  }, [isEditing, instructor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.warn("Please fill out all fields.");
      return;
    }

    setIsSaving(true);

    try {
      let response;
      const apiUrl = isEditing && instructor?.id 
        ? `http://localhost:8000/api/instructors/${instructor.id}`
        : "http://localhost:8000/api/instructors";

      const method = isEditing ? "put" : "post";
      
      response = await axios[method](apiUrl, formData);
      toast.success(`Instructor ${isEditing ? 'updated' : 'added'} successfully!`);
      
      onSave(response.data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save instructor.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEditing ? "Edit Instructor" : "New Instructor"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? "Update instructor details" : "Add a new instructor to the system"}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all"
                required
              />
            </div>
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
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

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