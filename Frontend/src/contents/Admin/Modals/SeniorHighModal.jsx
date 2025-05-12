import BaseModal from "./BaseModal";
import { useState, useEffect } from "react";
import ProgramService from "../../../services/ProgramService";
import GradeLevelService from "../../../services/GradeLevelService";
import { toast } from "react-toastify";

export default function SeniorHighModal({ isOpen, onClose, onSave, isEditing, program }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "SHS",
    strand: "",
    gradeLevel: ""
  });

  useEffect(() => {
    if (isEditing && program) {
      setFormData({
        name: program.name || "",
        code: program.code || "SHS",
        strand: program.strand || "",
        gradeLevel: program.gradeLevel || "",
      });
    } else {
      setFormData({
        name: "",
        code: "SHS",
        strand: "",
        gradeLevel: ""
      });
    }
  }, [isEditing, program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create programs and grade levels for both Grade 11 and Grade 12
      const gradeLevels = ["Grade 11", "Grade 12"];
      const createdPrograms = [];

      for (const gradeLevel of gradeLevels) {
        // Format the program name to include both strand and grade level
        const programName = `${formData.strand} - ${gradeLevel}`;
        
        // Create the program
        const programData = {
          name: programName,
          code: formData.code,
          category: "SHS",
          yearLevel: gradeLevel
        };

        let programResponse;
        if (isEditing && program) {
          programResponse = await ProgramService.update(program.id, programData);
        } else {
          programResponse = await ProgramService.create(programData);
        }

        // Create the grade level
        const gradeLevelData = {
          program_id: programResponse.program.id,
          name: gradeLevel
        };

        if (isEditing && program.gradeLevelId) {
          await GradeLevelService.update(program.gradeLevelId, gradeLevelData);
        } else {
          await GradeLevelService.create(gradeLevelData);
        }

        createdPrograms.push(programData);
      }

      toast.success(isEditing ? "Programs updated successfully" : "Programs added successfully");
      onSave(createdPrograms);
      onClose();
    } catch (error) {
      console.error("Error saving programs:", error);
      toast.error(error.response?.data?.message || "Failed to save programs");
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
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Grade Levels</label>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Both Grade 11 and Grade 12 will be created for this strand
          </div>
        </div>
        <button type="submit" className="bg-[#1F3463] text-white p-3 rounded w-full">
          {isEditing ? "Update" : "Save"}
        </button>
      </form>
    </BaseModal>
  );
}
