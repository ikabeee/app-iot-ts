import { Radar } from "react-chartjs-2";
import { ChartData } from "chart.js";

interface AveragesRadarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      pointBackgroundColor: string;
    }[];
  };
}

export default function AveragesRadarChart({ data }: AveragesRadarChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          callback: (value: number) => {
            if (value === 0) return '0';
            if (value === 25) return '25';
            if (value === 50) return '50';
            if (value === 75) return '75';
            if (value === 100) return '100';
            return '';
          }
        }
      }
    }
  };

  return <Radar data={data} options={options} />;
} 