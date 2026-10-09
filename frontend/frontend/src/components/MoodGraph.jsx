import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const MoodGraph = ({ moods = [] }) => {
  const moodMap = {
    Happy: 5,
    Calm: 4,
    Anxious: 3,
    Sad: 2,
    Angry: 1,
  };

  const moodColorMap = {
    Happy: "#30d158",
    Calm: "#64d2ff",
    Anxious: "#ffd60a",
    Sad: "#bf5af2",
    Angry: "#ff453a",
  };

  const safeMoods = moods && moods.length > 0 ? moods : [
    { mood: "Happy", createdAt: new Date(Date.now() - 86400000 * 4) },
    { mood: "Calm", createdAt: new Date(Date.now() - 86400000 * 3) },
    { mood: "Anxious", createdAt: new Date(Date.now() - 86400000 * 2) },
    { mood: "Calm", createdAt: new Date(Date.now() - 86400000) },
    { mood: "Happy", createdAt: new Date() },
  ];

  const labels = safeMoods.map((m) => {
    const d = new Date(m.createdAt);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Mood Level",
        data: safeMoods.map((m) => moodMap[m.mood] || 3),
        backgroundColor: safeMoods.map(
          (m) => moodColorMap[m.mood] || "#0a84ff"
        ),
        borderRadius: 14,
        borderSkipped: false,
        barThickness: 28,
        maxBarThickness: 38,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(18, 24, 38, 0.92)",
        titleColor: "#ffffff",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (ctx) => {
            const labels = {
              1: "Angry 😡 (1/5)",
              2: "Sad 😔 (2/5)",
              3: "Anxious 😰 (3/5)",
              4: "Calm 😌 (4/5)",
              5: "Happy 😊 (5/5)",
            };
            return labels[ctx.raw] || `Mood Level: ${ctx.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          font: {
            family: "Plus Jakarta Sans",
            size: 11,
            weight: "500",
          },
        },
      },
      y: {
        min: 0,
        max: 5.5,
        grid: {
          color: "rgba(255, 255, 255, 0.06)",
          drawBorder: false,
        },
        ticks: {
          stepSize: 1,
          color: "rgba(255, 255, 255, 0.65)",
          font: {
            family: "Plus Jakarta Sans",
            size: 12,
          },
          callback: (value) => {
            const labels = {
              1: "😡 Angry",
              2: "😔 Sad",
              3: "😰 Anxious",
              4: "😌 Calm",
              5: "😊 Happy",
            };
            return labels[value] || "";
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MoodGraph;

