import React, { useEffect, useState } from 'react';
import { FiUsers, FiUserCheck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import PieChart from "../../contents/Admin/Piechart";
import CompletionandPerformingInstructors from '../../contents/Admin/CompletionandPerformingInstructors';
import bgImage from "../../assets/Login.jpg";
import InstructorService from '../../services/InstructorService';
import StudentService from '../../services/StudentService';
import EvaluationService from '../../services/EvaluationService';

function ADashboard() {
  const [instructorsCount, setInstructorsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [notSubmittedCount, setNotSubmittedCount] = useState(0);

  const currentHour = new Date().getHours();

  const greeting = () => {
    if (currentHour < 12) return "Good Morning, Admin!";
    if (currentHour < 18) return "Good Afternoon, Admin!";
    return "Good Evening, Admin!";
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const instructors = await InstructorService.getAll();
        const students = await StudentService.getAll();

        setInstructorsCount(instructors.length);
        setStudentsCount(students.length);

        const evaluationStats = await EvaluationService.getOverallEvaluationSubmissionStats();
        setSubmittedCount(evaluationStats.submitted);
        setNotSubmittedCount(evaluationStats.not_submitted);

      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    { title: 'Number of Students', count: studentsCount, color: 'text-[#2196f3]', icon: <FiUsers size={28} /> },
    { title: 'Number of Instructors', count: instructorsCount, color: 'text-[#4caf50]', icon: <FiUserCheck size={28} /> },
    { title: 'Evaluation Submitted', count: submittedCount, color: 'text-[#9c27b0]', icon: <FiCheckCircle size={28} /> },
    { title: 'Evaluation Not Submitted', count: notSubmittedCount, color: 'text-[#f44336]', icon: <FiAlertCircle size={28} /> },
  ];

  return (
    <main className="p-5 min-h-screen dark:bg-gray-900 space-y-6">
      <div
        className={"relative rounded-2xl overflow-hidden shadow-md bg-[#1F3463] p-6 sm:p-8 text-white"}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-md">
            {greeting()}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-200">
            Here's an overview of today's system stats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
          <PieChart />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 gap-6">
          {stats.map(({ title, count, color, icon }) => (
            <div
              key={title}
              className="bg-gray-50 dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col justify-center items-center border border-gray-200 dark:border-gray-700 transition hover:shadow-xl hover:scale-105"
            >
              <div className={`p-3 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 ${color}`}>
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
                {title}
              </h3>
              <p className={`text-3xl font-bold ${color}`}>{count}</p>
            </div>
          ))}
        </div>
      </div>

      <CompletionandPerformingInstructors />
    </main>
  );
}

export default ADashboard;
