import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

function StudentProfileSetup() {
  const didRedirect = useRef(false);
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // Start at 0 for intro state
  const [educationLevel, setEducationLevel] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const yearLevelOptions = [
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
  ];

  const totalSteps = educationLevel === "Higher Education" ? 3 : 2;

  useEffect(() => {
    fetchPrograms();

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.profile_completed && !didRedirect.current) {
        didRedirect.current = true;
        navigate("/SDashboard");
      }
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        sessionStorage.setItem("user", JSON.stringify(response.data));
        if (response.data.profile_completed && !didRedirect.current) {
          didRedirect.current = true;
          navigate("/SDashboard");
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [navigate]);

  const fetchPrograms = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("No token found, please login again.");
      return;
    }

    try {
      const response = await api.get("/programs", {
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

    if (educationLevel === "Higher Education" && !selectedYearLevel) {
      toast.error("Year Level is required for Higher Education.");
      setLoading(false);
      return;
    }

    try {
      const chosenProgramForStep2 = programs.find(p => String(p.id) === selectedProgramId);

      const payload = {
        educationLevel: educationLevel,
        selectedOption: educationLevel === "Higher Education"
                        ? selectedProgramId
                        : chosenProgramForStep2?.name || "",
        yearLevel: educationLevel === "Higher Education" ? selectedYearLevel : null,
        programName: chosenProgramForStep2?.name || "",
      };

      const response = await api.post(
        "/student/setup-profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.profile_completed) {
        const updatedUser = response.data.user || response.data;
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("profileCompleted", "true");
        toast.success("Profile setup completed!");
        setTimeout(() => {
          navigate("/SDashboard");
        }, 800);
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
    if (step === 2) return !selectedProgramId;
    if (step === 3 && educationLevel === "Higher Education") return !selectedYearLevel;
    return false;
  };

  const stepVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const isStepCompleted = (currentStep) => {
    if (currentStep === 1) return !!educationLevel;
    if (currentStep === 2) return !!selectedProgramId;
    if (currentStep === 3 && educationLevel === "Higher Education") return !!selectedYearLevel;
    return false;
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {loading && <FullScreenLoader />}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl p-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Sidebar steps */}
        <div className="md:col-span-1 space-y-6 pr-8 border-r border-gray-200"> 
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Evaluation Profile Setup</h2> 
            <p className="text-sm text-gray-600 mt-1">Complete the steps to activate your account.</p> 
          </div>
          
          {/* Progress Bar and Step Counter */}
          <div className="pt-2">
            <div className="flex justify-between mb-1 items-center">
              <span className="text-xs font-medium text-[#1F3463]">
                {step > 0 ? `STEP ${step} OF ${totalSteps}` : "GETTING STARTED"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"> 
              <div
                className="bg-[#1F3463] h-2 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: step > 0 ? `${(step / totalSteps) * 100}%` : "0%" }}
              ></div>
            </div>
          </div>
          
          <ul className="space-y-5 pt-2">
            {step === 0 && (
              <li className="flex items-center gap-3 p-3 rounded-lg bg-[#1F3463]/10">
                <div className="w-5 h-5 rounded-full bg-[#1F3463]"></div>
                <div className="flex flex-col">
                  <span className="font-medium text-[#1F3463]">Get Started</span>
                </div>
              </li>
            )}
            
            {[1, 2, 3].map((s) => {
              if (s === 3 && educationLevel !== "Higher Education") return null;
              const active = step === s;
              const completed = isStepCompleted(s);
              let baseLabel = "";
              let selectedValue = "";

              if (s === 1) {
                baseLabel = "Education Level";
                if (completed) selectedValue = educationLevel;
              } else if (s === 2) {
                baseLabel = educationLevel === "Higher Education" ? "Program" : "Grade Level";
                if (completed) selectedValue = programs.find(p => String(p.id) === selectedProgramId)?.name || "";
              } else if (s === 3) {
                baseLabel = "Year Level";
                if (completed) selectedValue = selectedYearLevel;
              }

              return (
                <li
                  key={s}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out ${
                    active ? "bg-[#1F3463]/10" : "" 
                  } ${completed && !active ? "opacity-70" : ""}`}
                >
                  <div>
                    {completed ? (
                      <CheckCircle className={`w-5 h-5 ${active ? "text-[#1F3463]" : "text-green-500"}`} />
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          active ? "bg-[#1F3463] border-[#1F3463]" : "border-gray-300 bg-gray-100"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`font-medium ${
                        active ? "text-[#1F3463]" : completed ? "text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {baseLabel}
                    </span>
                    {completed && selectedValue && (
                      <span className={`text-xs mt-0.5 ${
                        active ? "text-[#1F3463]/80" : "text-gray-500"
                      }`}>
                        {selectedValue}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Step form */}
        <div className="md:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="intro" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800">Welcome to Profile Setup</h3>
                <p className="text-gray-600">Let's get started by setting up your academic profile. This will help us personalize your evaluation experience.</p>
                <div className="pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl transition min-w-[150px] bg-[#1F3463] hover:bg-[#15294e]"
                  >
                    Begin Setup
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800">What is your Education Level?</h3>
                {!educationLevel && (
                  <p className="text-sm text-red-500 -mt-4">Please select your education level to continue</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {["Higher Education", "Senior High", "Junior High", "Intermediate"].map((level) => (
                    <div
                      key={level}
                      onClick={() => {
                        setEducationLevel(level);
                        setSelectedProgramId("");
                        setSelectedYearLevel("");
                      }}
                      className={`cursor-pointer border rounded-xl px-4 py-6 text-center text-sm font-medium transition-colors ${
                        educationLevel === level 
                          ? "border-[#1F3463] bg-[#1F3463]/10 text-[#1F3463]" 
                          : "border-gray-300 text-gray-600 hover:border-[#1F3463]/50 hover:bg-[#1F3463]/5"
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {educationLevel === "Higher Education" ? "Select your program" : "Select your grade level"}
                </h3>
                {!selectedProgramId && (
                  <p className="text-sm text-red-500 -mt-4">Please make a selection to continue</p>
                )}
                <select
                  className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1F3463] hover:border-[#1F3463]/50 transition-colors"
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                >
                  <option value="">Select an option</option>
                  {programs
                    .filter(p => p.category === educationLevel)
                    .map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                </select>
              </motion.div>
            )}

            {step === 3 && educationLevel === "Higher Education" && (
              <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800">Select your year Level</h3>
                {!selectedYearLevel && (
                  <p className="text-sm text-red-500 -mt-4">Please select your year level</p>
                )}
                <select
                  className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1F3463] hover:border-[#1F3463]/50 transition-colors"
                  value={selectedYearLevel}
                  onChange={(e) => setSelectedYearLevel(e.target.value)}
                >
                  <option value="">Select year level</option>
                  {yearLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {step > 0 && (
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Start Over
                </button>
              )}
              
              <button
                onClick={step === totalSteps ? handleSubmit : () => setStep(step + 1)}
                disabled={isNextDisabled() || (loading && step === totalSteps)}
                className={`flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl transition min-w-[150px] ${
                  (isNextDisabled() || (loading && step === totalSteps))
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#1F3463] hover:bg-[#15294e]"
                }`}
              >
                {loading && step === totalSteps ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Finishing...
                  </>
                ) : step === totalSteps ? (
                  "Finish Setup"
                ) : (
                  "Continue"
                )}
                {!(loading && step === totalSteps) && step !== totalSteps && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfileSetup;