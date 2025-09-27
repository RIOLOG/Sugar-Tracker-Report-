
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ReadingsChart() {
  const [chartData, setChartData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchChartData = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/readings/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Transform the API data into the format Chart.js needs
        const labels = res.data.map(r => new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Before Lunch',
              data: res.data.map(r => r.beforeLunch),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'After Lunch',
              data: res.data.map(r => r.afterLunch),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
              label: 'Before Dinner',
              data: res.data.map(r => r.beforeDinner),
              borderColor: 'rgb(255, 206, 86)',
              backgroundColor: 'rgba(255, 206, 86, 0.5)',
            },
            {
              label: 'After Dinner',
              data: res.data.map(r => r.afterDinner),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      }
    };

    fetchChartData();
  }, [token]);

const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Blood Sugar Levels (Last 15 Days)', font: { size: 18 } },
    },
    scales: { y: { title: { display: true, text: 'mg/dL' } } }
  };

  if (!chartData) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8 text-center">
            <p className="text-slate-500">Loading chart data...</p>
        </div>
    );
  }

 return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-end mb-4">
        <Link to="/" className="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700">
          &larr; Back to Report List
        </Link>
      </div>
      
      <div className="relative h-96 w-full">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}