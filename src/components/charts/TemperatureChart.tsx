"use client"

import { Line } from "react-chartjs-2"
import type { ChartOptions } from "chart.js"

interface TemperatureChartProps {
  data: any
  timeRange: string
}

export default function TemperatureChart({ data, timeRange }: TemperatureChartProps) {
  // Modificar las opciones del gráfico para mostrar más datos
  const options: ChartOptions<"line"> = {
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
        beginAtZero: false,
        title: {
          display: true,
          text: "Temperatura (°C)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          stepSize: 0.5,
        },
      },
    },
  }

  return <Line options={options} data={data} />
}

