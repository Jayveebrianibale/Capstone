import { useState } from "react";
import BaseModal from "./BaseModal";
import { toast } from "react-toastify";
import axios from "axios";

function IntermediateModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({ sectionName: "", grade: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sectionName || !formData.grade) {
      toast.warn("All fields are required");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/programs", { ...formData, category: "Intermediate" });
      toast.success("Program added successfully");
      onSave(response.data);
      onClose();
    } catch (error) {
      toast.error("Failed to save program");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Intermediate">
      <form onSubmit={handleSubmit}>
        <input type="text" name="sectionName" placeholder="Section Name" value={formData.sectionName} onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
        <select name="grade" value={formData.grade} onChange={handleChange} required className="w-full mb-4 p-2 border rounded">
          <option value="">Select Grade Level</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
        </select>
        <button type="submit" className="bg-[#1F3463] text-white p-2 rounded w-full">Save</button>
      </form>
    </BaseModal>
  );
}

export default IntermediateModal;
