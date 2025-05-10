import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CompletionIndicator = ({ value, size = 200 }) => {
  const strokeWidth = 12;

  return (
    <div
      className="flex flex-col items-center mt-8"
      style={{ width: size, height: size }}
    >
      <div style={{ width: size, height: size }}>
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          strokeWidth={strokeWidth}
          styles={{
            path: {
              stroke: "#1F3463",
              strokeLinecap: "round", 
              transition: "stroke-dashoffset 0.5s ease 0s",
            },
            trail: {
              stroke: "#e6e6e6",
            },
            text: {
              fill: "#1F3463", 
              fontSize: `${size / 10}px`,
              fontWeight: "bold", 
            },
          }}
        />
      </div>
    </div>
  );
};

export default CompletionIndicator;
