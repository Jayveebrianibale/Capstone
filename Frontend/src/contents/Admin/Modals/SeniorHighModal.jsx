import BaseModal from "./BaseModal";
import { useState, useEffect } from "react";
import ProgramService from "../../../services/ProgramService";
import GradeLevelService from "../../../services/GradeLevelService";
import { toast } from "react-toastify";

export default function SeniorHighModal({ isOpen, onClose, onSave, isEditing, program }) {
  const [formData, setFormData] = useState({
    strand: "",
    code: "SHS",
    gradeLevel: ""
  });

  useEffect(() => {
    if (isEditing && program) {
      setFormData({
        strand: program.strand || "",
        code: program.code || "SHS",
        gradeLevel: program.gradeLevel || ""
      });
    } else {
      setFormData({
        strand: "",
        code: "SHS",
        gradeLevel: ""
      });
    }
  }, [isEditing, program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gradeLevel) {
      toast.warning("Please select a grade level.");
      return;
    }

    const programName = `${formData.strand} - ${formData.gradeLevel}`;

    const programData = {
      name: programName,
      code: formData.code,
      category: "SHS",
      yearLevel: formData.gradeLevel
    };

    try {
      let programResponse;
      if (isEditing && program) {
        programResponse = await ProgramService.update(program.id, programData);
      } else {
        programResponse = await ProgramService.create(programData);
      }

      const gradeLevelData = {
        program_id: programResponse.program.id,
        name: formData.gradeLevel
      };

      if (isEditing && program.gradeLevelId) {
        await GradeLevelService.update(program.gradeLevelId, gradeLevelData);
      } else {
        await GradeLevelService.create(gradeLevelData);
      }

      toast.success(isEditing ? "Program updated successfully" : "Program added successfully");
      onSave(programData);
      onClose();
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error(error.response?.data?.message || "Failed to save program");
    }
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
            placeholder="Enter strand name (e.g., STEM, ABM, HUMSS)"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Grade Level</label>
          <select
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 rounded-lg p-3"
            required
          >
            <option value="" disabled>Select grade level</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>

        <button type="submit" className="bg-[#1F3463] text-white p-3 rounded w-full">
          {isEditing ? "Update" : "Save"}
        </button>
      </form>
    </BaseModal>
  );
}
