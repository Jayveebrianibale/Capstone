import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import "react-toastify/dist/ReactToastify.css";
import BackgroundPic from "../../assets/Login.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

function StudentProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [educationLevel, setEducationLevel] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const educationOptions = {
    "Senior High": ["Grade 11", "Grade 12"],
    "Junior High": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    "Intermediate": ["Grade 4", "Grade 5", "Grade 6"],
  };

  const totalSteps = educationLevel === "Higher Education" ? 3 : 2;

  const yearLevelOptions = [
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
  ];

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.profile_completed) navigate("/SDashboard");
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        sessionStorage.setItem("user", JSON.stringify(response.data));
        if (response.data.profile_completed) navigate("/SDashboard");
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [navigate]);

  useEffect(() => {
    if (educationLevel === "Higher Education") {
      fetchPrograms();
    }
  }, [educationLevel]);

  const fetchPrograms = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("No token found, please login again.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/programs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const extracted = Array.isArray(response.data)
        ? response.data
        : response.data.programs || [];
      setPrograms(extracted);
    } catch (err) {
      console.error("Failed to fetch programs:", err);
      toast.error("Failed to load programs.");
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }
  
    setLoading(true);
  
    try {
      // Validate payload before submitting
      const payload = {
        educationLevel,
        selectedOption: selectedProgramId,
        yearLevel: selectedYearLevel,
      };
  
      console.log("Submitting Profile Setup Payload:", payload);
  
      const response = await axios.post(
        "http://127.0.0.1:8000/api/student/setup-profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Setup Profile API Response:", response.data);
  
      if (response.data.profile_completed === 1) {
        // Profile setup is marked as completed
        const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Fetched User After Setup:", userResponse.data);
  
        if (userResponse.data.profile_completed === 1) {
          sessionStorage.setItem("user", JSON.stringify(userResponse.data));
          toast.success("Profile setup completed!");
          navigate("/SDashboard");
        } else {
          toast.error("Profile update failed. Please try again.");
        }
      } else {
        toast.error("Profile setup was not completed correctly.");
      }
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error.message);
      toast.error(
        `Failed to set up profile: ${error.response?.data?.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };
  

  const isNextDisabled = () => {
    if (step === 1) return !educationLevel;
    if (step === 2) {
      if (educationLevel === "Higher Education") return !selectedProgramId;
      return !selectedYearLevel;
    }
    if (step === 3) return !selectedYearLevel;
    return false;
  };

  const stepVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-4 overflow-hidden">
      {loading && <FullScreenLoader />}

      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${BackgroundPic})` }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative w-full max-w-xl bg-white shadow-2xl rounded-3xl p-10 transition-all z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profile Setup</h1>
          <p className="text-gray-500 mt-2">Let's complete your student profile</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-3 w-12 rounded-full transition-all ${
                index + 1 <= step ? "bg-[#1F3463]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mb-8"
            >
              <label className="block font-semibold text-gray-700 mb-3 text-lg">
                Education Level
              </label>
              <select
                className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1F3463]"
                value={educationLevel}
                onChange={(e) => {
                  setEducationLevel(e.target.value);
                  setSelectedProgramId("");
                  setSelectedYearLevel("");
                }}
              >
                <option value="">Select Education Level</option>
                <option value="Higher Education">Higher Education</option>
                <option value="Senior High">Senior High</option>
                <option value="Junior High">Junior High</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mb-8"
            >
              <label className="block font-semibold text-gray-700 mb-3 text-lg">
                {educationLevel === "Higher Education" ? "Program" : "Grade Level"}
              </label>
              <select
                className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1F3463]"
                value={
                  educationLevel === "Higher Education"
                    ? selectedProgramId
                    : selectedYearLevel
                }
                onChange={(e) => {
                  if (educationLevel === "Higher Education") {
                    setSelectedProgramId(e.target.value);
                    setSelectedYearLevel("");
                  } else {
                    setSelectedYearLevel(e.target.value);
                  }
                }}
              >
                <option value="">Select an option</option>
                {educationLevel === "Higher Education"
                  ? programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))
                  : educationOptions[educationLevel]?.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
              </select>
            </motion.div>
          )}

          {step === 3 && educationLevel === "Higher Education" && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mb-8"
            >
              <label className="block font-semibold text-gray-700 mb-3 text-lg">
                Year Level
              </label>
              <select
                className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1F3463]"
                value={selectedYearLevel}
                onChange={(e) => setSelectedYearLevel(e.target.value)}
              >
                <option value="">Select Year Level</option>
                {yearLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl flex items-center gap-2"
            >
              <ArrowLeft /> Back
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={() =>
              step === totalSteps ? handleSubmit() : setStep(step + 1)
            }
            className={`px-6 py-3 ${
              isNextDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#1F3463]"
            } text-white rounded-xl flex items-center gap-2`}
            disabled={isNextDisabled()}
          >
            {step === totalSteps ? "Finish" : "Next"}
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileSetup;
