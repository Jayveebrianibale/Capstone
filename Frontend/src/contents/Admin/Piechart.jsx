import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
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
  const chartRef = useRef(null);

  const descriptions = {
    5: 'Exceedingly Well',
    4: 'Good',
    3: 'Fair',
    2: 'Needs Improvement',
    1: 'Poor',
  };

  const colors = {
    5: '#1F3463',
    4: '#2F4F91',
    3: '#3E64B3',
    2: '#6C8CD5',
    1: '#A3B7E8',
  };

  useEffect(() => {
    EvaluationService.getAllInstructorDistributions().then((instructors) => {
      if (!instructors.length) return;
  
      // Aggregate counts across all instructors
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
    });
  }, []);
  
  // Then in your chartData:
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
    plugins: {
      tooltip: { enabled: false },
      datalabels: {
        color: 'white',
        formatter: (value, context) => {
          const idx = context.dataIndex;
          const realValue = distribution[idx]?.percentage || 0;
          return `${realValue.toFixed(1)}%`;
        },
        font: { weight: 'bold', size: 14 },
        align: 'center',
        anchor: 'center',
      },
      legend: {
        display: false,
      },
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
      {distribution.length === 0 || distribution.every(item => item.value === 0) ? (
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
            There are no evaluation results to display yet. Once evaluations are submitted, you’ll see a summary here.
          </p>
        </div>
      ) : (
        <>
          {/* Custom Rating Legend */}
          <div className="flex gap-4 mb-4">
            {distribution.map((item) => (
              <div key={item.label} className="flex items-center space-x-2">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
          <div
            className="relative w-full max-w-[250px] aspect-square"
            onMouseLeave={() => setTooltip(null)}
          >
            <Pie ref={chartRef} data={chartData} options={options} />

            {tooltip && (
              <div
                style={{
                  position: 'absolute',
                  top: `${tooltipPosition.y}px`,
                  left: `${tooltipPosition.x}px`,
                  transform: 'translate(-50%, -100%)',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontSize: 14,
                  whiteSpace: 'pre-line',
                  pointerEvents: 'none',
                  zIndex: 10,
                  maxWidth: 180,
                  textAlign: 'center',
                }}
              >
                {tooltip}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">
              Average Teaching Ratings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Based on the latest evaluations.
            </p>
          </div>
        </>
      )}
    </div>
  );
}