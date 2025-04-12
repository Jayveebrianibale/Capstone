import React, { useState, useEffect } from 'react';

export default function CustomPieChart() {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); 
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const data = [
    { label: '5', value: 10, color: '#1F3463', description: 'Exceedingly Well' },
    { label: '4', value: 15, color: '#2F4F91', description: 'Good' },
    { label: '3', value: 20, color: '#3E64B3', description: 'Fair' },
    { label: '2', value: 25, color: '#6C8CD5', description: 'Needs Improvement' },
    { label: '1', value: 30, color: '#A3B7E8', description: 'Poor' },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  const cx = 100;
  const cy = 100;
  const radius = 80;
  const labelRadius = 50;

  let cumulativeValue = 0;

  const pieSlices = data.map((item, index) => {
    const startAngle = (cumulativeValue / total) * 2 * Math.PI;
    cumulativeValue += item.value;
    const endAngle = (cumulativeValue / total) * 2 * Math.PI;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    const d = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    const midAngle = (startAngle + endAngle) / 2;
    const labelX = cx + labelRadius * Math.cos(midAngle);
    const labelY = cy + labelRadius * Math.sin(midAngle);

    return (
      <g key={index}>
        <path
          d={d}
          fill={item.color}
          style={{
            transition: 'transform 0.3s ease-out',
            transform: hoveredSlice === index ? 'scale(1.1)' : 'scale(1)',
          }}
          onMouseEnter={() => {
            setHoveredSlice(index);
            setTooltip(item.description);

            const tooltipX = cx + (radius + 20) * Math.cos(midAngle); 
            let tooltipY = cy + (radius + 20) * Math.sin(midAngle) - 20; 
            const tooltipSidewaysOffset = 40; 
            const tooltipXAdjusted = tooltipX + tooltipSidewaysOffset;

            if (item.label === '2') {
              tooltipY -= 20;
            }

            setTooltipPosition({ x: tooltipXAdjusted, y: tooltipY });
          }}
          onMouseLeave={() => {
            setHoveredSlice(null);
            setTooltip(null);
          }}
        />
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
        >
          {item.value}%
        </text>
      </g>
    );
  });

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark'); 
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    return () => {
      darkModeMediaQuery.removeEventListener('change', () => {});
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center p-6 rounded-lg dark:bg-gray-800 dark:text-white bg-white text-black">
      <svg width="250" height="250" viewBox="0 0 200 200">
        {pieSlices}
      </svg>
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
          }}
        >
          <span>{tooltip}</span>
        </div>
      )}
    </div>
  );
}
