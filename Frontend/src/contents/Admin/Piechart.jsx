import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { FiFilter } from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import EvaluationService from '../../services/EvaluationService';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function CustomPieChart() {
  const [distribution, setDistribution] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [educationLevel, setEducationLevel] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const chartRef = useRef(null);

  const educationLevels = [
    { value: 'All', label: 'All' },
    { value: 'Higher Education', label: 'Higher Ed' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Junior High', label: 'Junior High' },
    { value: 'Senior High', label: 'Senior High' },
  ];

  const descriptions = {
    5: 'Rating: 5',
    4: 'Rating: 4',
    3: 'Rating: 3',
    2: 'Rating: 2',
    1: 'Rating: 1',
  };

  const colors = {
    5: '#1F3463',
    4: '#2F4F91',
    3: '#3E64B3',
    2: '#6C8CD5',
    1: '#A3B7E8',
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = async (level = 'All') => {
    setIsLoading(true);
    try {
      const instructors = await EvaluationService.getAllInstructorDistributions(level === 'All' ? null : level);
      
      if (!instructors.length) {
        setDistribution([]);
        return;
      }

      const totalCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      instructors.forEach(inst => {
        [1, 2, 3, 4, 5].forEach(r => {
          totalCounts[r] += parseInt(inst[`rating_${r}_count`], 10) || 0;
        });
      });

      const totalRatings = Object.values(totalCounts).reduce((sum, count) => sum + count, 0);

      const ratings = [5, 4, 3, 2, 1]
        .map((r) => {
          const count = totalCounts[r];
          return {
            label: `${r}`,
            value: count,
            percentage: totalRatings > 0 ? (count / totalRatings) * 100 : 0,
            color: colors[r],
            description: descriptions[r],
          };
        })
        .filter(item => item.value > 0);

      setDistribution(ratings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(educationLevel);
  }, [educationLevel]);

  const handleEducationLevelChange = (e) => {
    setEducationLevel(e.target.value);
    setShowFilter(false);
  };

  const chartData = {
    labels: distribution.map((item) => `${item.label}`),
    datasets: [
      {
        data: distribution.map((item) => item.percentage),
        backgroundColor: distribution.map((item) => item.color),
        hoverBackgroundColor: distribution.map((item) => item.color),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
      datalabels: {
        color: 'white',
        formatter: (value, context) => {
          const idx = context.dataIndex;
          const realValue = distribution[idx]?.percentage || 0;
          return `${realValue.toFixed(1)}%`;
        },
        font: { weight: 'bold', size: isMobile ? 12 : 14 },
        align: 'center',
        anchor: 'center',
      },
      legend: { display: false },
    },
    interaction: { mode: 'nearest', intersect: true },
    onHover: (event, chartElements) => {
      if (chartElements.length > 0) {
        const idx = chartElements[0].index;
        const rect = chartRef.current?.canvas.getBoundingClientRect();
        if (!rect) return;
        const { clientX, clientY } = event;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const item = distribution[idx];
        setTooltip(
          `${item.description}\nCount: ${item.value}\nPercentage: ${item.percentage.toFixed(2)}%`
        );
        setTooltipPosition({ x, y: y - 20 });
      } else {
        setTooltip(null);
      }
    },
  };

  return (
    <div className="relative flex flex-col items-center w-full p-4 sm:p-6 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white">
      {/* Responsive Filter */}
      <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'}`}>
        <div className="relative">
          <button 
            onClick={() => setShowFilter(prev => !prev)}
            className={`flex items-center p-1 rounded-md ${
              isMobile ? 'bg-gray-100 dark:bg-gray-700 text-xs' : 'text-sm'
            } hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
          >
            <FiFilter size={isMobile ? 14 : 16} className="mr-1" />
            {educationLevel === 'All' ? 'All' : educationLevels.find(l => l.value === educationLevel)?.label}
          </button>
          
          {showFilter && (
            <div className={`absolute right-0 mt-1 z-50 ${
              isMobile ? 'w-32' : 'w-40'
            } bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600`}>
              <select
                value={educationLevel}
                onChange={handleEducationLevelChange}
                className="block w-full px-2 py-1 text-sm border-0 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                size={isMobile ? 4 : undefined}
              >
                {educationLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : distribution.length === 0 || distribution.every(item => item.value === 0) ? (
        <div className="flex flex-col items-center justify-center h-64 w-full">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 48 48"
          >
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M24 8v16l12 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
            No Evaluation Data
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
            {educationLevel === 'All' ? 'No data for any education level' : `No data for ${educationLevel} Students`}
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 sm:gap-4 mb-3 sm:mb-4 flex-wrap justify-center">
            {distribution.map((item) => (
              <div key={item.label} className="flex items-center space-x-1 sm:space-x-2">
                <span
                  className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-xs sm:text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="relative w-full max-w-[250px] aspect-square">
            <Pie ref={chartRef} data={chartData} options={options} />
            {tooltip && (
              <div
                className="absolute bg-gray-900 text-white p-2 rounded text-xs sm:text-sm pointer-events-none z-10 max-w-[180px] text-center"
                style={{
                  top: `${tooltipPosition.y}px`,
                  left: `${tooltipPosition.x}px`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                {tooltip}
              </div>
            )}
          </div>

          <div className="text-center mt-3 sm:mt-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
              Average Teaching Ratings
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {educationLevel === 'All' ? 'All education levels' : educationLevel}
            </p>
          </div>
        </>
      )}
    </div>
  );
}