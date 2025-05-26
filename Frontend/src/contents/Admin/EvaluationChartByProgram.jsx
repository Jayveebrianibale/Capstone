import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import EvaluationService from '../../services/EvaluationService';

// Custom color palette
const colors = ['#1F3463', '#2F4F91', '#3E64B3', '#6C8CD5', '#A3B7E8'];

const EvaluationChartByProgram = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const response = await EvaluationService.getProgramEvaluationStats();
        if (Array.isArray(response) && response.length > 0) {
          const formatted = response.map(item => ({
            program: item.program_code,
            Submitted: item.submitted,
            NotSubmitted: item.not_submitted,
          }));
          setData(formatted);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setData([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Completion by Program/Levels
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading chart data...
          </p>
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="program" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Submitted" fill={colors[0]} />
            <Bar dataKey="NotSubmitted" fill={colors[3]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-[300px] border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No evaluation data available for programs at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationChartByProgram;
