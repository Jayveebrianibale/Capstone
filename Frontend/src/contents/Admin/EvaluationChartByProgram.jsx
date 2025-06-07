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
    <div className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
        Completion by Program/Levels
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-[200px] sm:h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1F3463]"></div>
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="program"
              tick={{ fill: textColor, fontWeight: 500, fontSize: 12 }}
              stroke={gridColor}
            />
            <YAxis
              tick={{ fill: textColor, fontWeight: 500, fontSize: 12 }}
              stroke={gridColor}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: textColor, fontWeight: '500', fontSize: 12 }}
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
        <div className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2a4a] flex items-center justify-center shadow-sm border border-[#e0e7ff] dark:border-gray-600 mb-3 sm:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-[#1F3463] dark:text-[#5d7cbf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 text-center">
            No Evaluation Data Available
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center max-w-[200px] sm:max-w-xs">
            No evaluation data available for programs at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationChartByProgram;