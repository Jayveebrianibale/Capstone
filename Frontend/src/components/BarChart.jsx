import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    text: {
      primary: 'black',
    },
    background: {
      default: '#fff',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      primary: 'white',
    },
    background: {
      default: '#121212',
    },
  },
});

const ChartsOverviewDemo = ({ isDarkMode }) => {
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <BarChart
        series={[
          { data: [35, 44, 24, 34] },
          { data: [51, 6, 49, 30] },
          { data: [15, 25, 30, 50] },
          { data: [60, 50, 15, 25] },
        ]}
        height={290}
        xAxis={[
          {
            data: ['Q1', 'Q2', 'Q3', 'Q4'],
            scaleType: 'band',
          },
        ]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        sx={{
          '& .MuiChart-legendText': { color: currentTheme.palette.text.primary },
          '& .MuiChart-axisLabel': { color: currentTheme.palette.text.primary },
          '& .MuiChart-axisTick': { color: currentTheme.palette.text.primary },
        }}
      />
    </ThemeProvider>
  );
};

export default ChartsOverviewDemo;
