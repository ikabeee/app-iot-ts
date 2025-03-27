import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";

interface TimeDataPoint {
  x: number | Date;
  y: number | null;
}

interface TemperatureChartProps {
  data: {
    datasets: {
      label: string;
      data: TimeDataPoint[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      pointRadius?: number;
      pointHoverRadius?: number;
    }[];
  };
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day',
          tooltipFormat: 'PP',
          displayFormats: { 
            day: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        grid: {
          display: true
        },
        ticks: {
          source: 'auto',
          maxRotation: 45
        }
      },
      y: { 
        beginAtZero: false,
        title: {
          display: true,
          text: 'Temperatura (°C)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          stepSize: 0.5
        }
      }
    }
  };

  return <Line data={data} options={options} />;
} 