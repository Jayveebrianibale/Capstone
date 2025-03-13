import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentProfileSetup() {
  const navigate = useNavigate();
  const [educationLevel, setEducationLevel] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const educationOptions = {
    "Higher Education": ["BS Information Systems", "BS Computer Science", "BS Business Administration"],
    "Senior High": ["Grade 11", "Grade 12"],
    "Junior High": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    "Intermediate": ["Grade 4", "Grade 5", "Grade 6"]
  };

  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("Authentication failed. Please log in again.");
      return;
    }
  
    setLoading(true);
  
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/student/setup-profile",
        { educationLevel, selectedOption, yearLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      
      const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (userResponse.data.profile_completed) {
       
        localStorage.setItem("user", JSON.stringify(userResponse.data));
  
        navigate("/SDashboard");
      } else {
        alert("Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error.message);
      alert(`Failed to set up profile: ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  const isButtonDisabled = !educationLevel || !selectedOption || 
    (educationLevel === "Higher Education" && !yearLevel);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800">Profile Setup</h2>
        <p className="text-gray-500 text-center mb-6">
          Select your details to complete your profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Education Level</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              value={educationLevel}
              onChange={(e) => {
                setEducationLevel(e.target.value);
                setSelectedOption("");
                setYearLevel("");
              }}
              required
            >
              <option value="">Select Education Level</option>
              {Object.keys(educationOptions).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {educationLevel && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                {educationLevel === "Higher Education" ? "Program" : "Grade Level"}
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                required
              >
                <option value="">Select {educationLevel === "Higher Education" ? "Program" : "Grade Level"}</option>
                {educationOptions[educationLevel].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}

          {educationLevel === "Higher Education" && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Year Level</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
                required
              >
                <option value="">Select Year Level</option>
                {yearLevels.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            className={`w-full text-white font-semibold p-3 rounded-md transition-all ${
              isButtonDisabled || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
            disabled={isButtonDisabled || loading}
          >
            {loading ? "Processing..." : "Proceed to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentProfileSetup;
