import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function InstructorModal({ isOpen, onClose, onSave, isEditing, instructorToEdit }) {
  const [instructors, setInstructors] = useState([{ name: "", email: "" }]);
  const [isSaving, setIsSaving] = useState(false); 

  useEffect(() => {
    if (isEditing && instructorToEdit) {
      setInstructors([{ name: instructorToEdit.name || "", email: instructorToEdit.email || "" }]);
    }
  }, [isEditing, instructorToEdit]);

  const handleChange = (index, field, value) => {
    const updatedInstructors = [...instructors];
    updatedInstructors[index][field] = value.trimStart();
    setInstructors(updatedInstructors);
  };

  const addMoreFields = () => {
    setInstructors([...instructors, { name: "", email: "" }]);
  };


const handleSave = async () => {
  if (isSaving) return; // Prevent duplicate requests

  if (instructors.some((i) => !i.name.trim() || !i.email.trim())) {
    toast.warn("Please fill out all fields.");
    return;
  }

  setIsSaving(true); // Disable button to prevent multiple requests

  const payload = instructors.map(i => ({
    name: i.name.trim(),
    email: i.email.trim(),
  }))[0];

  try {
    await axios.post("http://localhost:8000/api/instructors", payload);

    toast.success("Instructor(s) saved successfully!");
    setInstructors([{ name: "", email: "" }]); // ✅ Clear input fields
    onSave(payload);
    onClose();
  } catch (error) {
    toast.error("Failed to save instructor.");
  } finally {
    setIsSaving(false); // Re-enable the button
  }
};

  const isSaveDisabled = instructors.some((i) => !i.name.trim() || !i.email.trim());

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Instructor" : "Add Instructor(s)"}
          </h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[65vh] pr-2">
          {instructors.map((instructor, index) => (
            <div key={index} className="relative p-4 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {!isEditing && instructors.length > 1 && (
                <button
                  onClick={() => setInstructors(instructors.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-red-500"
                  title="Remove this instructor"
                >
                  ✖
                </button>
              )}
              <label className="block font-semibold text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={instructor.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Instructor Name"
                className="w-full border dark:border-gray-600 rounded p-3 mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <label className="block font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={instructor.email}
                onChange={(e) => handleChange(index, "email", e.target.value)}
                placeholder="Email"
                className="w-full border dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          ))}
        </div>

        {!isEditing && (
          <div className="flex justify-center mt-4">
            <button
              onClick={addMoreFields}
              className="w-full bg-[#1F3463] hover:bg-indigo-800 text-white px-3 py-2 rounded-md text-sm"
            >
              + Add Another Instructor
            </button>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
  onClick={handleSave}
  className={`px-4 py-2 rounded-md text-sm ${
    isSaving || isSaveDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#1F3463] hover:bg-indigo-700 text-white"
  }`}
  disabled={isSaving || isSaveDisabled}
>
  {isSaving ? "Saving..." : isEditing ? "Update" : instructors.length > 1 ? "Save All" : "Save"}
</button>

        </div>
      </div>
    </div>
  ) : null;
}
