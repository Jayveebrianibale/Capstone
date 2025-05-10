import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function CustomPieChart() {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const chartRef = useRef(null);

  const data = [
    { label: '5', value: 10, color: '#1F3463', description: 'Exceedingly Well' },
    { label: '4', value: 15, color: '#2F4F91', description: 'Good' },
    { label: '3', value: 20, color: '#3E64B3', description: 'Fair' },
    { label: '2', value: 25, color: '#6C8CD5', description: 'Needs Improvement' },
    { label: '1', value: 30, color: '#A3B7E8', description: 'Poor' },
  ];

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        hoverBackgroundColor: data.map((item) => item.color),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
      datalabels: {
        formatter: (value) => `${value}%`,
        font: {
          weight: 'bold',
          size: 14,
        },
        align: 'center',
        anchor: 'center',
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        const { x, y } = chartElement[0].element;

        setHoveredSlice(index);
        setTooltip(data[index].description);
        setTooltipPosition({ x, y: y - 20 });
      } else {
        setHoveredSlice(null);
        setTooltip(null);
      }
    },
  };

  useEffect(() => {
    const chartCanvas = chartRef.current?.canvas;
    if (!chartCanvas) return;

    const handleMouseLeave = () => {
      setHoveredSlice(null);
      setTooltip(null);
    };

    chartCanvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      chartCanvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [chartRef]);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const darkModeChangeHandler = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    darkModeMediaQuery.addEventListener('change', darkModeChangeHandler);

    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeChangeHandler);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center p-6 rounded-lg dark:bg-gray-800 dark:text-white bg-white text-black">
      <div style={{ position: 'relative', width: '250px', height: '250px' }}>
        <Pie ref={chartRef} data={chartData} options={options} />
        {tooltip && (
          <div
            style={{
              position: 'absolute',
              top: `${tooltipPosition.y}px`,
              left: `${tooltipPosition.x}px`,
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <span>{tooltip}</span>
          </div>
        )}
      </div>
    </div>
  );
}
