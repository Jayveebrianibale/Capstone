import { useState } from "react";
import BaseModal from "./BaseModal";
import { toast } from "react-toastify";
import axios from "axios";

function JuniorHighModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({ sectionName: "", grade: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sectionName || !formData.grade) {
      toast.warn("All fields are required");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/programs", { ...formData, category: "Junior_High" });
      toast.success("Program added successfully");
      onSave(response.data);
      onClose();
    } catch (error) {
      toast.error("Failed to save program");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Junior High">
      <form onSubmit={handleSubmit}>
        <input type="text" name="sectionName" placeholder="Grade/Section Name" value={formData.sectionName} onChange={handleChange} required className="w-full mb-4 p-2 border rounded" />
        <select name="grade" value={formData.grade} onChange={handleChange} required className="w-full mb-4 p-2 border rounded">
          <option value="">Select Grade Level</option>
          <option value="Grade 7">Grade 7</option>
          <option value="Grade 8">Grade 8</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 10">Grade 10</option>
        </select>
        <button type="submit" className="bg-[#1F3463] text-white p-2 rounded w-full">Save</button>
      </form>
    </BaseModal>
  );
}

export default JuniorHighModal;
