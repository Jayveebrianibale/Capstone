"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsChart() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const data = [
    { name: "Q1", rating: 4.5 },
    { name: "Q2", rating: 4.9 },
    { name: "Q3", rating: 2.2 },
    { name: "Q4", rating: 3.0 },
    { name: "Q5", rating: 4.5 },
    { name: "Q6", rating: 2.8 },
    { name: "Q7", rating: 3.2 },
    { name: "Q8", rating: 4.6 },
    { name: "Q9", rating: 4.9 },
  ];

  // Colors based on theme
  const textColor = isDarkMode ? "#e5e7eb" : "#374151";
  const gridColor = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";
  const tooltipBg = isDarkMode ? "#1f2937" : "#fff";
  const tooltipBorder = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";
  const tooltipTextColor = isDarkMode ? "#e5e7eb" : "#374151";

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          key={isDarkMode ? "dark" : "light"} // force remount on theme change
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke={gridColor} />
          <XAxis
            dataKey="name"
            tick={{ fill: textColor, fontWeight: 500 }}
            stroke={gridColor}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fill: textColor, fontWeight: 500 }}
            stroke={gridColor}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              color: tooltipTextColor,
              fontWeight: "500",
            }}
            labelStyle={{ color: tooltipTextColor, fontWeight: "500" }}
            itemStyle={{ color: tooltipTextColor, fontWeight: "500" }}
          />
          <Legend
            wrapperStyle={{ color: textColor, fontWeight: "500" }}
            verticalAlign="top"
            height={36}
          />
          <Bar dataKey="rating" fill="#1F3463" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
