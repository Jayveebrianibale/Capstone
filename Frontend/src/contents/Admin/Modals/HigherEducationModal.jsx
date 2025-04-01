import BaseModal from "./BaseModal";
import { useState, useEffect } from "react";

export default function HigherEducationModal({ isOpen, onClose, onSave, isEditing, program }) {
  const [formData, setFormData] = useState({ name: "", code: "", yearLevel: "" });

  useEffect(() => {
    if (isEditing && program) {
      setFormData({
        name: program.name || "",
        code: program.code || "",
        yearLevel: program.yearLevel || "",
      });
    } else {
      setFormData({ name: "", code: "", yearLevel: "" });
    }
  }, [isEditing, program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const programData = {
        name: formData.name,
        code: formData.code,
        yearLevel: formData.yearLevel, 
        category: "Higher Education",
    };

    onSave(programData, isEditing, program?.id);
};

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Higher Education Program" : "Add Higher Education Program"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Program Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 rounded-lg p-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Program Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 rounded-lg p-3"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Year Level</label>
          <select
            name="yearLevel"
            value={formData.yearLevel}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 rounded-lg p-3"
            required
          >
            <option value="">Select Level</option>
            {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-[#1F3463] text-white p-3 rounded w-full">
          {isEditing ? "Update" : "Save"}
        </button>
      </form>
    </BaseModal>
  );
}
