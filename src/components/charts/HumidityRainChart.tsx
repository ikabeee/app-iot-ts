import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";

interface TimeDataPoint {
  x: Date;
  y: number;
}

interface HumidityRainChartProps {
  data: {
    datasets: {
      label: string;
      data: TimeDataPoint[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
    }[];
  };
}

export default function HumidityRainChart({ data }: HumidityRainChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day',
          tooltipFormat: 'PP',
          displayFormats: { day: 'MMM d' }
        }
      },
      y: { 
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valor'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
} 