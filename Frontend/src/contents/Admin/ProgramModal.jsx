import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function ProgramModal({ isOpen, onClose, onSave, isEditing, program }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    educationLevel: "",
    yearOrGrade: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && program) {
      setFormData({
        name: program.name || "",
        code: program.code || "",
        educationLevel: program.educationLevel || "",
        yearOrGrade: program.yearOrGrade || "",
      });
    } else {
      setFormData({ name: "", code: "", educationLevel: "", yearOrGrade: "" });
    }
  }, [isEditing, program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.code.trim() || !formData.educationLevel.trim() || !formData.yearOrGrade.trim()) {
      toast.warn("Please fill out all fields.");
      return;
    }

    setIsSaving(true);

    // Format data to match backend requirements
    const payload = {
      name: formData.name,
      category: formData.educationLevel, // Matches backend field
      levels: formData.educationLevel === "Higher_Education" ? [{ name: formData.yearOrGrade }] : [],
    };

    try {
      let response;
      if (isEditing && program?.id) {
        response = await axios.put(`http://localhost:8000/api/programs/${program.id}`, payload);
        toast.success("Program updated successfully!");
      } else {
        response = await axios.post("http://localhost:8000/api/programs", payload);
        toast.success("Program added successfully!");
      }

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error saving program:", error.response?.data); // Debugging line
      toast.error(error.response?.data?.message || "Failed to save program.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-[500px] max-w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Program" : "Add Program"}
          </h2>
          <button onClick={onClose} aria-label="Close modal" className="text-gray-600 dark:text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold text-gray-700 dark:text-gray-300">
              Program Name / Grade Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Program Name"
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="code" className="block font-semibold text-gray-700 dark:text-gray-300">
              Program Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Program Code"
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Fixed Education Level Dropdown */}
          <div className="mb-4">
            <label htmlFor="educationLevel" className="block font-semibold text-gray-700 dark:text-gray-300">
              Education Level
            </label>
            <select
              id="educationLevel"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Education Level</option>
              <option value="Higher_Education">Higher Education</option>
              <option value="Senior_High">Senior High</option>
              <option value="Junior_High">Junior High</option>
              <option value="Intermediate">Intermediate</option>
            </select>
          </div>

          {/* Fixed Year or Grade Level Dropdown */}
          <div className="mb-6">
            <label htmlFor="yearOrGrade" className="block font-semibold text-gray-700 dark:text-gray-300">
              {formData.educationLevel === "Higher_Education" ? "Year Level" : "Grade Level"}
            </label>
            <select
              id="yearOrGrade"
              name="yearOrGrade"
              value={formData.yearOrGrade}
              onChange={handleChange}
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">
                Select {formData.educationLevel === "Higher_Education" ? "Year" : "Grade"} Level
              </option>
              {formData.educationLevel === "Higher_Education"
                ? ["1st Year", "2nd Year", "3rd Year", "4th Year"].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))
                : ["Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map(
                    (grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    )
                  )}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-md text-sm font-semibold transition ${
                isSaving ? "bg-gray-300 cursor-not-allowed" : "bg-[#1F3463] hover:bg-indigo-700 text-white"
              }`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
