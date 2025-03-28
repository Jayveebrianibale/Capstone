import BaseModal from "./BaseModal";
import { useState, useEffect } from "react";

export default function SeniorHighModal({ isOpen, onClose, onSave, isEditing, program }) {
  const [formData, setFormData] = useState({ name: "", strand: "", gradeLevel: "" });

  useEffect(() => {
    if (isEditing && program) {
      setFormData({
        name: program.name || "",
        strand: program.strand || "",
        gradeLevel: program.gradeLevel || "",
      });
    } else {
      setFormData({ name: "", strand: "", gradeLevel: "" });
    }
  }, [isEditing, program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Senior High Program" : "Add Senior High"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Strand Name</label>
          <input
            type="text"
            name="strand"
            value={formData.strand}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 rounded-lg p-3"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Grade Level</label>
          <select
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 rounded-lg p-3"
            required
          >
            <option value="">Select Level</option>
            {["Grade 11", "Grade 12"].map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
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
