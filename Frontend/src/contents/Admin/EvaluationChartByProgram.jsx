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
  const dummyData = [
    { program: 'BSIS', Submitted: 30, NotSubmitted: 10 },
    { program: 'BSA', Submitted: 45, NotSubmitted: 5 },
    { program: 'BSSW', Submitted: 20, NotSubmitted: 20 },
    { program: 'ACT', Submitted: 30, NotSubmitted: 10 },
    { program: 'BAB', Submitted: 45, NotSubmitted: 5 },
    { program: 'BSAIS', Submitted: 20, NotSubmitted: 20 },
  ];

  const [data, setData] = useState(dummyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await EvaluationService.getEvaluationSubmissionByProgram();
        if (Array.isArray(response) && response.length > 0) {
          const formatted = response.map(item => ({
            program: item.program,
            Submitted: item.submitted,
            NotSubmitted: item.not_submitted,
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Completion by Program/Levels
      </h2>
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
      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Loading real data...
        </p>
      )}
    </div>
  );
};

export default EvaluationChartByProgram;
