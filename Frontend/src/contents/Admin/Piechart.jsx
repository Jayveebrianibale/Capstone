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
    EvaluationService.getTopInstructorDistributions().then((instructors) => {
      if (!instructors.length) return;
  
      const inst = instructors[0];
  
      const totalRatings = [1, 2, 3, 4, 5].reduce(
        (sum, r) => sum + parseInt(inst[`rating_${r}_count`], 10),
        0
      );
  
      const ratings = [5, 4, 3, 2, 1].map((r) => {
        const count = parseInt(inst[`rating_${r}_count`], 10);
        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
  
        return {
          label: `${r}`,
          value: count,
          percentage,
          color: colors[r],
          description: descriptions[r],
        };
      });
  
      setDistribution(ratings);
    });
  }, []);
  
  
  
  const minSliceValue = 1;
  const chartData = {
    labels: distribution.map((item) => `${item.label}`),
    datasets: [
      {
        data: distribution.map((item) => item.percentage > 0 ? item.percentage : minSliceValue),
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
        display: false, // ⛔ Hides the legend with redundant text
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
      {distribution.length === 0 ? (
        <div className="text-center">No data to display</div>
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
          <div className="relative w-full max-w-[280px] aspect-square">
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
        </>
      )}
    </div>
  );
}