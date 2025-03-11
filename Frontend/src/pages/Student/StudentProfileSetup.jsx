import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentProfileSetup() {
  const navigate = useNavigate();
  const [educationLevel, setEducationLevel] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [courses, setCourses] = useState([]); // Ensure it's always an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/courses")
      .then((response) => {
        setCourses(Array.isArray(response.data) ? response.data : []);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setLoading(false);
      });
  }, []);
  


  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!educationLevel || !selectedCourse || !semester) {
      alert("Please fill in all fields.");
      return;
    }
  
    const token = localStorage.getItem("authToken");
  
    
    if (!token) {
      console.error("No auth token found!");
      alert("Authentication failed. Please log in again.");
      return;
    }
    
    console.log("Sending token:", token);
  
    axios
      .post(
        "http://127.0.0.1:8000/api/student/setup-profile",
        { educationLevel, selectedCourse, semester },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log("Profile setup successful:", response.data);
        navigate("/SDashboard");
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
        alert("Failed to set up profile.");
      });
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-center">Set Up Your Evaluation</h2>
        <p className="text-gray-600 text-center mb-4">
          Please select your details to complete Evaluations.
        </p>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              className="w-full p-2 border rounded"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              required
            >
              <option value="">Select Education Level</option>
              <option value="Higher Education">Higher Education</option>
              <option value="Senior High">Senior High</option>
              <option value="Junior High">Junior High</option>
              <option value="Intermediate">Intermediate</option>
            </select>

            <select
              className="w-full p-2 border rounded"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {Array.isArray(courses) &&
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
            </select>

            <select
              className="w-full p-2 border rounded"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Complete Setup
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default StudentProfileSetup;
