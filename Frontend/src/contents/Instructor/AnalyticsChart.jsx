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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Fetch questions + ratings
  useEffect(() => {
    async function loadChart() {
      if (!instructorId) return;
      const questions = await QuestionsService.getAll();
      const results = await InstructorService.getInstructorEvaluationResults(
        instructorId
      );
      const ratingMap = results.reduce((acc, x) => {
        acc[x.question_id] = parseFloat(x.avg_rating);
        return acc;
      }, {});
      // Build chart-ready array
      setData(
        questions.map((q) => ({
          name: `Qn${q.id}`,  
          rating: ratingMap[q.id] ?? 0,
        }))
      );
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

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
          <Bar dataKey="rating" radius={[4, 4, 0, 0]}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
