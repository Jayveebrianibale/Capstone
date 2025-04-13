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
  const [selectedOption, setSelectedOption] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const educationOptions = {
    "Higher Education": ["BS Information Systems", "BS Computer Science", "BS Business Administration"],
    "Senior High": ["Grade 11", "Grade 12"],
    "Junior High": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    "Intermediate": ["Grade 4", "Grade 5", "Grade 6"],
  };

  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const totalSteps = educationLevel === "Higher Education" ? 3 : 2;

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

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
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
        sessionStorage.setItem("user", JSON.stringify(userResponse.data));
        toast.success("Profile setup completed!");
        navigate("/SDashboard");
      } else {
        toast.error("Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error.message);
      toast.error(`Failed to set up profile: ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !educationLevel;
    if (step === 2) return !selectedOption;
    if (step === 3) return !yearLevel;
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
            <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="mb-8">
              <label className="block font-semibold text-gray-700 mb-3 text-lg">Education Level</label>
              <select
                className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1F3463]"
                value={educationLevel}
                onChange={(e) => {
                  setEducationLevel(e.target.value);
                  setSelectedOption("");
                  setYearLevel("");
                }}
              >
                <option value="">Select Education Level</option>
                {Object.keys(educationOptions).map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="mb-8">
              <label className="block font-semibold text-gray-700 mb-3 text-lg">
                {educationLevel === "Higher Education" ? "Program" : "Grade Level"}
              </label>
              <select
                className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1F3463]"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Select</option>
                {educationOptions[educationLevel]?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {step === 3 && educationLevel === "Higher Education" && (
            <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="mb-8">
              <label className="block font-semibold text-gray-700 mb-3 text-lg">Year Level</label>
              <select
                className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1F3463]"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
              >
                <option value="">Select Year Level</option>
                {yearLevels.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mt-6">
          {step > 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep((prev) => prev - 1)}
              className="px-6 py-3 rounded-xl border text-gray-600 hover:bg-gray-100 transition flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </motion.button>
          ) : (
            <div></div>
          )}

          {step < totalSteps ? (
            <motion.button
              whileHover={{ scale: isNextDisabled() ? 1 : 1.05 }}
              whileTap={{ scale: isNextDisabled() ? 1 : 0.95 }}
              disabled={isNextDisabled()}
              onClick={() => setStep((prev) => prev + 1)}
              className={`px-6 py-3 rounded-xl text-white transition flex items-center gap-2 ${
                isNextDisabled()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#1F3463] hover:bg-[#1c2f59]"
              }`}
            >
              Next <ArrowRight size={20} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: isNextDisabled() ? 1 : 1.05 }}
              whileTap={{ scale: isNextDisabled() ? 1 : 0.95 }}
              disabled={isNextDisabled()}
              onClick={handleSubmit}
              className={`px-6 py-3 rounded-xl text-white transition flex items-center gap-2 ${
                isNextDisabled()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#1F3463] hover:bg-[#1c2f59]"
              }`}
            >
              Finish <ArrowRight size={20} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfileSetup;
