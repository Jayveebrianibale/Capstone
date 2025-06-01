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
  Cell
} from 'recharts';
import EvaluationService from '../../services/EvaluationService';

// Program-specific colors as requested
const programColors = {
  BAB: '#1F3463',       // darkBlue
  BSSW: '#FFD700',      // yellow
  BSAIS: '#7B61FF',     // violet
  BSIS: '#800000',      // maroon
  ACT: '#FF8C00',       // orange
  BSA: '#CDA4FF',       // lightViolet
  default: '#A3B7E8'    // fallback color
};

const EvaluationChartByProgram = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

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
            yearLevel: item.yearLevel,
          }));
          setData(formatted);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const textColor = isDarkMode ? '#e5e7eb' : '#374151';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipBg = isDarkMode ? '#1f2937' : '#fff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipTextColor = isDarkMode ? '#e5e7eb' : '#374151';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { program, yearLevel } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            color: tooltipTextColor,
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <p style={{ fontWeight: 'bold' }}>{program} (Year {yearLevel})</p>
          {payload.map((entry, index) => (
            <p key={index}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getColorForProgram = (program) => {
    return programColors[program] || programColors.default;
  };

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
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="program"
              tick={{ fill: textColor, fontWeight: 500 }}
              stroke={gridColor}
            />
            <YAxis
              tick={{ fill: textColor, fontWeight: 500 }}
              stroke={gridColor}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: textColor, fontWeight: '500' }}
              verticalAlign="top"
              height={36}
            />
            <Bar dataKey="Submitted" name="Submitted">
              {data.map((entry, index) => (
                <Cell 
                  key={`submitted-${index}`} 
                  fill={getColorForProgram(entry.program)} 
                />
              ))}
            </Bar>
            <Bar dataKey="NotSubmitted" name="Not Submitted" fill="#A3B7E8" />
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