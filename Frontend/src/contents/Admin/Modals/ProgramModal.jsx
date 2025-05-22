import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../services/api";

export default function ProgramModal({ isOpen, onClose, onSave, isEditing, program, selectedCategory }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    sectionName: "",
    strandName: "",
    yearOrGrade: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && program) {
      setFormData({
        name: program.name || "",
        code: program.code || "",
        sectionName: program.sectionName || "",
        strandName: program.strandName || "",
        yearOrGrade: program.yearOrGrade || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        sectionName: "",
        strandName: "",
        yearOrGrade: "",
      });
    }
  }, [isEditing, program, selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      !formData.name ||
      !formData.yearOrGrade ||
      (selectedCategory === "Higher_Education" && !formData.code)
    ) {
      toast.warn("Please fill out all required fields.");
      return;
    }
  
    setIsSaving(true);
  
    const payload = {
      name: formData.name,
      category: selectedCategory,
      code: selectedCategory === "Higher_Education" ? formData.code : null,
      sectionName: ["Intermediate", "Junior_High"].includes(selectedCategory)
        ? formData.sectionName
        : null,
      strandName: selectedCategory === "Senior_High" ? formData.strandName : null,
      levels:
        selectedCategory === "Higher_Education"
          ? [{ name: formData.yearOrGrade }]
          : [],
    };
  
    console.log("Payload to be sent:", payload);
  
    try {
      let response;
  
      if (isEditing && program?.id) {
        response = await api.put(`/programs/${program.id}`, payload);
        toast.success("Program updated successfully!");
      } else {
        response = await api.post("/programs", payload);
        toast.success("Program added successfully!");
      }
  
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error saving program:", error.response?.data);
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
          {/* Program Name or Grade Level */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300">
              {selectedCategory === "Higher_Education" ? "Program Name" : 
               selectedCategory === "Senior_High" ? "Grade Level" : "Grade/Strand Name"}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Program Code (Only for Higher Education) */}
          {selectedCategory === "Higher_Education" && (
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">Program Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter code"
                className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Section Name (For Intermediate & Junior High) */}
          {["Intermediate", "Junior_High"].includes(selectedCategory) && (
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">Section Name</label>
              <input
                type="text"
                name="sectionName"
                value={formData.sectionName}
                onChange={handleChange}
                placeholder="Enter section name"
                className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Strand Name (For Senior High) */}
          {selectedCategory === "Senior_High" && (
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">Strand Name</label>
              <input
                type="text"
                name="strandName"
                value={formData.strandName}
                onChange={handleChange}
                placeholder="Enter strand name"
                className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Year or Grade Level */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 dark:text-gray-300">
              {selectedCategory === "Higher_Education" ? "Year Level" : "Grade Level"}
            </label>
            <select
              name="yearOrGrade"
              value={formData.yearOrGrade}
              onChange={handleChange}
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Level</option>
              {selectedCategory === "Higher_Education" && ["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
              {selectedCategory === "Intermediate" && ["Grade 4", "Grade 5", "Grade 6"].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
              {selectedCategory === "Junior_High" && ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
              {selectedCategory === "Senior_High" && ["Grade 11", "Grade 12"].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}
