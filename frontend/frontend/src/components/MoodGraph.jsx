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

const MoodGraph = ({ moods }) => {
  const moodMap = {
    Happy: 5,
    Calm: 4,
    Anxious: 3,
    Sad: 2,
    Angry: 1,
  };

  const moodColorMap = {
    Happy: "#4CAF50",
    Calm: "#2196F3",
    Anxious: "#FFC107",
    Sad: "#9C27B0",
    Angry: "#F44336",
  };

  const labels = moods.map((m) =>
    new Date(m.createdAt).toLocaleDateString()
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Mood Level",
        data: moods.map((m) => moodMap[m.mood]),
        backgroundColor: moods.map(
          (m) => moodColorMap[m.mood] || "#90A4AE"
        ),
        borderRadius: 8,
         barThickness: 40,        // 👈 direct width (px)
    maxBarThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Mood Level: ${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const labels = {
              1: "Angry 😡",
              2: "Sad 😔",
              3: "Anxious 😰",
              4: "Calm 😌",
              5: "Happy 😊",
            };
            return labels[value] || value;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MoodGraph;
