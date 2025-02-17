import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';

export default function PieArcLabel() {
  const theme = useTheme();

  const data = [
    { id: 0, value: 10, label: '😍         ' },
    { id: 1, value: 15, label: '😊         ' },
    { id: 2, value: 20, label: '😐         ' },
    { id: 3, value: 25, label: '🙁         ' },
    { id: 4, value: 30, label: '😡         ' }
  ];

  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.value}%`,
          arcLabelMinAngle: 35,
          arcLabelRadius: '60%',
          data: data,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          fontWeight: 'bold',
          fontSize: '14px',
        },
      }}
      width={400}
      height={200}
    />
  );
}
