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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function AnalyticsChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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
        },
      },
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
        backgroundColor: "#1F3463",
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
