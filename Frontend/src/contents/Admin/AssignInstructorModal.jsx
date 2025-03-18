import React, { useState, useEffect } from "react";
import { assignInstructorToCourse } from "../../services/InstructorService";

function AssignInstructorModal({ isOpen, onClose, instructor }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedCourse) return alert("Please select a course!");

    try {
      await assignInstructorToCourse(instructor.id, selectedCourse);
      alert("Instructor assigned successfully!");
      onClose();
    } catch (error) {
      console.error("Error assigning instructor:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Assign {instructor.name} to a Course
        </h2>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full mt-4 p-2 border rounded"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.course_name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleAssign} className="px-4 py-2 bg-green-600 text-white rounded">
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignInstructorModal;
