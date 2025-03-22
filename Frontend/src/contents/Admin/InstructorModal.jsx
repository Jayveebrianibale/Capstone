import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
      if (isEditing && instructor?.id) {
        response = await axios.put(
          `http://localhost:8000/api/instructors/${instructor.id}`,
          formData
        );
        toast.success("Instructor updated successfully!");
      } else {
        response = await axios.post(
          "http://localhost:8000/api/instructors",
          formData
        );
        toast.success("Instructor added successfully!");
      }

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-[500px] max-w-full transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Instructor" : "Add Instructor"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-600 dark:text-gray-400 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block font-semibold text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Instructor Name"
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block font-semibold text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-md text-sm font-semibold transition ${
                isSaving
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#1F3463] hover:bg-indigo-700 text-white"
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
