import { Bar } from "react-chartjs-2"

interface TimeDataPoint {
  x: Date
  y: number
}

interface SunExposureChartProps {
  data: {
    datasets: {
      label: string
      data: TimeDataPoint[]
      backgroundColor: string
      borderColor: string
      borderWidth?: number
      borderRadius?: number
    }[]
  }
}

export default function SunExposureChart({ data }: SunExposureChartProps) {
  // Modificar las opciones del gráfico para mostrar más datos
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          title: (context: any) => {
            if (context[0].parsed.x) {
              const date = new Date(context[0].parsed.x)
              return date.toLocaleString("es-ES", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            }
            return ""
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "minute",
          stepSize: 15,
          tooltipFormat: "HH:mm",
          displayFormats: {
            minute: "HH:mm",
            hour: "HH:mm",
            day: "MMM d",
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          source: "auto",
          maxRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Exposición solar (%)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}

