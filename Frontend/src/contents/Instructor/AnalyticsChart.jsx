"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function AnalyticsChart() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: isDarkMode ? '#e5e7eb' : '#374151'
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151'
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
  };

  const labels = ["Q1", "Q2", "Q3", 
    "Q4", "Q5", "Q6", "Q7", 
    "Q8", "Q9"];

  const data = {
    labels,
    datasets: [
      {
        label: "Average Rating",
        data: [4.5, 4.9, 2.2, 3.0, 4.5, 2.8, 3.2, 4.6, 4.9],
        backgroundColor: isDarkMode ? "#4B5563" : "#1F3463",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="h-[300px] w-full">
      <Bar options={options} data={data} />
    </div>
  );
}
