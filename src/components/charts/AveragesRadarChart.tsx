"use client"

import { Radar } from "react-chartjs-2"
import type { ChartOptions } from "chart.js"

interface AveragesRadarChartProps {
  data: any
}

export default function AveragesRadarChart({ data }: AveragesRadarChartProps) {
  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed !== null) {
              const value = context.parsed.r
              // Añadir unidades según el índice
              const units = ["% de sol", "mm de lluvia", "% de humedad", "°C"]
              const index = context.dataIndex
              label += value + (units[index] ? ` ${units[index]}` : "")
            }
            return label
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        suggestedMin: 0,
        pointLabels: {
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          backdropColor: "transparent",
          showLabelBackdrop: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
      },
    },
  }

  return <Radar options={options} data={data} />
}

