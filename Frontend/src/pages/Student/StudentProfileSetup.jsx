import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

function StudentProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [educationLevel, setEducationLevel] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const educationOptions = {
    "Senior High": ["Grade 11", "Grade 12"],
    "Junior High": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    "Intermediate": ["Grade 4", "Grade 5", "Grade 6"],
  };

  const yearLevelOptions = [
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
  ];

  const totalSteps = educationLevel === "Higher Education" ? 3 : 2;

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.profile_completed) {
        navigate("/SDashboard");
      }
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios.get("http://127.0.0.1:8000/api/user", {
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
    setErrorMessage("");

    try {
      const payload = {
        education_level: educationLevel,
        program_id: educationLevel === "Higher Education" ? selectedProgramId : null,
        year_level: selectedYearLevel,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/student/setup-profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.profile_completed) {
        sessionStorage.setItem("user", JSON.stringify(response.data.user || response.data));
        toast.success("Profile setup completed!");
        navigate("/SDashboard");
      } else {
        throw new Error("Profile setup was not completed correctly.");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Unknown error";
      setErrorMessage(message);
      toast.error(`Failed to set up profile: ${message}`);
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

  const isStepCompleted = (currentStep) => {
    if (currentStep === 1) return !!educationLevel;
    if (currentStep === 2)
      return educationLevel === "Higher Education"
        ? !!selectedProgramId
        : !!selectedYearLevel;
    if (currentStep === 3) return !!selectedYearLevel;
    return false;
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gray-100 p-4">
      {loading && <FullScreenLoader />}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl p-16 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div className="md:col-span-1 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Profile Setup</h2>
            <p className="text-sm text-gray-500">Follow the steps to complete your profile</p>
          </div>
          <ul className="space-y-4">
            {[1, 2, 3].map((s) => {
              if (s === 3 && educationLevel !== "Higher Education") return null;
              const label =
                s === 1
                  ? "Education Level"
                  : s === 2
                  ? educationLevel === "Higher Education"
                    ? "Program"
                    : "Grade Level"
                  : "Year Level";
              const active = step === s;
              const completed = isStepCompleted(s);
              return (
                <li
                  key={s}
                  className={`flex items-center gap-2 ${
                    active
                      ? "text-[#1F3463] font-bold"
                      : completed
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full ${
                        active ? "bg-[#1F3463]" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                  {label}
                </li>
              );
            })}
          </ul>
        </div>


        <div className="md:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  What is your education level?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {["Higher Education", "Senior High", "Junior High", "Intermediate"].map((level) => (
                    <div
                      key={level}
                      onClick={() => {
                        setEducationLevel(level);
                        setSelectedProgramId("");
                        setSelectedYearLevel("");
                      }}
                      className={`cursor-pointer border rounded-xl px-4 py-6 text-center text-sm font-medium ${
                        educationLevel === level
                          ? "border-[#1F3463] bg-[#1F3463]/10 text-[#1F3463]"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {educationLevel === "Higher Education"
                    ? "Select your program"
                    : "Select your grade level"}
                </h3>
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
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Select your year level
                </h3>
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

          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl flex items-center gap-2 text-sm"
              >
                <ArrowLeft /> Back
              </button>
            ) : (
              <div></div>
            )}
            <button
              onClick={() => (step === totalSteps ? handleSubmit() : setStep(step + 1))}
              className={`px-4 py-2 ${
                isNextDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#1F3463]"
              } text-white rounded-xl flex items-center gap-2 text-sm`}
              disabled={isNextDisabled()}
            >
              {step === totalSteps ? "Finish" : "Next"} <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileSetup;
