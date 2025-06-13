import { useEffect, useState } from "react";
import QuestionsService from "../../services/QuestionService";
import InstructorService from "../../services/InstructorService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AnalyticsChart({ instructorId }) {
  const [data, setData] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dark-mode watcher
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleBarClick = (data) => {
    if (data && data.activePayload) {
      const questionNumber = data.activePayload[0].payload.name.replace('Qn', '');
      const questionElement = document.getElementById(`question-${questionNumber}`);
      
      if (questionElement) {
        // Remove highlight from all questions first
        document.querySelectorAll('.question-row').forEach(row => {
          row.classList.remove('bg-blue-100', 'dark:bg-blue-900/20');
        });
        
        // Add highlight to clicked question
        questionElement.classList.add('bg-blue-100', 'dark:bg-blue-900/20');
        
        // Scroll to the question
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
          questionElement.classList.remove('bg-blue-100', 'dark:bg-blue-900/20');
        }, 3000);
      }
    }
  };

  // Fetch questions + ratings
  useEffect(() => {
    async function loadChart() {
      if (!instructorId) return;
      setLoading(true);
      try {
        const questions = await QuestionsService.getAll();
        const results = await InstructorService.getInstructorEvaluationResults(
          instructorId
        );
        const ratingMap = results.reduce((acc, x) => {
          acc[x.question_id] = parseFloat(x.avg_rating);
          return acc;
        }, {});

        // Calculate overall rating
        const totalRating = Object.values(ratingMap).reduce((sum, rating) => sum + rating, 0);
        const avgRating = Object.values(ratingMap).length > 0 
          ? (totalRating / Object.values(ratingMap).length) * 20 
          : 0;
        setOverallRating(avgRating);

        // Build chart-ready array
        setData(
          questions.map((q) => ({
            name: `Qn${q.id}`,  
            Rating: ratingMap[q.id] ?? 0,
          }))
        );
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadChart();
  }, [instructorId]);

  const colors = ['#1F3463', '#2F4F91', '#3E64B3', '#6C8CD5', '#A3B7E8'];
  const textColor = isDarkMode ? "#e5e7eb" : "#374151";
  const gridColor = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";
  const tooltipBg = isDarkMode ? "#1f2937" : "#fff";
  const tooltipBorder = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";
  const tooltipTextColor = isDarkMode ? "#e5e7eb" : "#374151";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3463]"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Overall Average Rating
        </h3>
        <div className="text-3xl font-bold text-black dark:text-white">
          {overallRating.toFixed(2)}%
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={handleBarClick}
          >
            <CartesianGrid stroke={gridColor} />
            <XAxis
              dataKey="name"
              tick={{ fill: textColor, fontWeight: 500 }}
              stroke={gridColor}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fill: textColor, fontWeight: 500 }}
              stroke={gridColor}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                color: tooltipTextColor,
                fontWeight: "500",
              }}
              labelStyle={{ color: tooltipTextColor, fontWeight: "500" }}
              itemStyle={{ color: tooltipTextColor, fontWeight: "500" }}
            />
            <Legend
              wrapperStyle={{ color: textColor, fontWeight: "500" }}
              verticalAlign="top"
              height={36}
            />
            <Bar dataKey="Rating" radius={[4, 4, 0, 0]} cursor="pointer">
              {data.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
