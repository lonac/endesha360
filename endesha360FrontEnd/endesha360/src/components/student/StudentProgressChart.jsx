import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Progress',
      data: [20, 40, 60, 75],
      borderColor: '#00712D',
      backgroundColor: 'rgba(0,113,45,0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Course Progress', color: '#00712D', font: { size: 18 } },
  },
  scales: {
    y: { beginAtZero: true, max: 100, ticks: { color: '#00712D' } },
    x: { ticks: { color: '#00712D' } },
  },
};

const StudentProgressChart = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <Line data={data} options={options} />
  </div>
);

export default StudentProgressChart;
