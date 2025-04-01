"use client"

import { useEffect, useState, useMemo } from "react"
import HistoryPlotService from "../services/HistoryPlotService"
import SensorService from "../services/SensorService"
import PlotService from "../services/PlotService"
import { Card, CardBody, CardHeader } from "@heroui/card"
import Map from "../components/Map"
import MeasureCard from "../components/MeasureCard"
import TemperatureChart from "../components/charts/TemperatureChart"
import HumidityRainChart from "../components/charts/HumidityRainChart"
import AveragesRadarChart from "../components/charts/AveragesRadarChart"
import SunExposureChart from "../components/charts/SunExposureChart"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  RadialLinearScale,
  Filler,
  BarElement,
} from "chart.js"
import "chartjs-adapter-date-fns"
import { subHours } from "date-fns"

// Estilos personalizados para el scroll
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.03);
  }
`

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  RadialLinearScale,
  Filler,
)

interface HistoryPlot {
  id: number
  sun: number
  rain: number
  humidity: number
  temperature: number
  date: string
  plotId: number
}

interface SensorData {
  sun: number
  rain: number
  humidity: number
  temperature: number
}

interface Plot {
  id: number
  lat: number
  lng: number
  name: string
  status: string
  location: string
  manager: string
  cropType: string
  lastWatering: string
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    sun: 0,
    rain: 0,
    humidity: 0,
    temperature: 0,
  })

  const [historyData, setHistoryData] = useState<HistoryPlot[]>([])
  const [activePlots, setActivePlots] = useState<Plot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("24h")

  // Obtener datos del sensor original
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await SensorService.getSensors()
        const data = response.data
        const latestData = data.sort(
          (a: HistoryPlot, b: HistoryPlot) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0]
        setSensorData({
          sun: latestData.sun,
          rain: latestData.rain,
          humidity: latestData.humidity,
          temperature: latestData.temperature,
        })
      } catch (error) {
        console.error("Error fetching sensor data:", error)
      }
    }
    fetchSensorData()
  }, [])

  // Obtener datos históricos para gráficos
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await HistoryPlotService.getAllHistoryPlot()
        setHistoryData(response.data)
      } catch (error) {
        console.error("Error fetching history data:", error)
      }
    }
    fetchHistoryData()
  }, [])

  // Obtener parcelas activas para el mapa
  useEffect(() => {
    const fetchActivePlots = async () => {
      try {
        const response = await PlotService.getAllPlots()
        const active = response.data.filter((plot: Plot) => plot.status === "ACTIVE")
        setActivePlots(active)
      } catch (error) {
        console.error("Error fetching active plots:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchActivePlots()
  }, [])

  // Modificar la función filterDataByTimeRange para limitar la cantidad de datos según el rango
  const filterDataByTimeRange = (data: HistoryPlot[]) => {
    const now = new Date()
    let cutoffTime: Date

    switch (selectedTimeRange) {
      case "6h":
        cutoffTime = subHours(now, 6)
        break
      case "12h":
        cutoffTime = subHours(now, 12)
        break
      case "24h":
      default:
        cutoffTime = subHours(now, 24)
        break
    }

    // Filtrar por el rango de tiempo seleccionado
    return data.filter((item) => new Date(item.date) >= cutoffTime)
  }

  // Reemplazar la función de agrupación de datos para mostrar más detalles
  const processDataForCharts = (data: HistoryPlot[]) => {
    // Ordenar por fecha (más antiguo primero)
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Para rangos cortos, mostrar más granularidad
    let groupingInterval: number
    switch (selectedTimeRange) {
      case "6h":
        groupingInterval = 5 // Agrupar cada 5 minutos
        break
      case "12h":
        groupingInterval = 10 // Agrupar cada 10 minutos
        break
      case "24h":
      default:
        groupingInterval = 15 // Agrupar cada 15 minutos
        break
    }

    // Agrupar datos por intervalos de minutos
    const groupDataByMinutes = (data: HistoryPlot[], intervalMinutes: number) => {
      const groupedData = data.reduce(
        (acc, entry) => {
          const date = new Date(entry.date)
          // Redondear al intervalo de minutos más cercano
          const minutes = date.getMinutes()
          const roundedMinutes = Math.floor(minutes / intervalMinutes) * intervalMinutes
          date.setMinutes(roundedMinutes, 0, 0)

          const timeKey = date.toISOString()

          if (!acc[timeKey]) {
            acc[timeKey] = {
              date: date,
              temperature: entry.temperature,
              humidity: entry.humidity,
              rain: entry.rain,
              sun: entry.sun,
              count: 1,
              min: {
                temperature: entry.temperature,
                humidity: entry.humidity,
                rain: entry.rain,
                sun: entry.sun,
              },
              max: {
                temperature: entry.temperature,
                humidity: entry.humidity,
                rain: entry.rain,
                sun: entry.sun,
              },
            }
          } else {
            // Actualizar promedios
            acc[timeKey].temperature =
              (acc[timeKey].temperature * acc[timeKey].count + entry.temperature) / (acc[timeKey].count + 1)
            acc[timeKey].humidity =
              (acc[timeKey].humidity * acc[timeKey].count + entry.humidity) / (acc[timeKey].count + 1)
            acc[timeKey].rain = (acc[timeKey].rain * acc[timeKey].count + entry.rain) / (acc[timeKey].count + 1)
            acc[timeKey].sun = (acc[timeKey].sun * acc[timeKey].count + entry.sun) / (acc[timeKey].count + 1)

            // Actualizar mínimos y máximos
            acc[timeKey].min.temperature = Math.min(acc[timeKey].min.temperature, entry.temperature)
            acc[timeKey].min.humidity = Math.min(acc[timeKey].min.humidity, entry.humidity)
            acc[timeKey].min.rain = Math.min(acc[timeKey].min.rain, entry.rain)
            acc[timeKey].min.sun = Math.min(acc[timeKey].min.sun, entry.sun)

            acc[timeKey].max.temperature = Math.max(acc[timeKey].max.temperature, entry.temperature)
            acc[timeKey].max.humidity = Math.max(acc[timeKey].max.humidity, entry.humidity)
            acc[timeKey].max.rain = Math.max(acc[timeKey].max.rain, entry.rain)
            acc[timeKey].max.sun = Math.max(acc[timeKey].max.sun, entry.sun)

            acc[timeKey].count++
          }
          return acc
        },
        {} as Record<
          string,
          {
            date: Date
            temperature: number
            humidity: number
            rain: number
            sun: number
            count: number
            min: { temperature: number; humidity: number; rain: number; sun: number }
            max: { temperature: number; humidity: number; rain: number; sun: number }
          }
        >,
      )

      return Object.values(groupedData).sort((a, b) => a.date.getTime() - b.date.getTime())
    }

    // Agrupar datos según el intervalo seleccionado
    return groupDataByMinutes(sortedData, groupingInterval)
  }

  // Reemplazar la parte del useMemo que procesa los datos
  const { lineChartData, areaChartData, radarChartData, sunChartData, plotSpecificData } = useMemo(() => {
    if (historyData.length === 0)
      return {
        lineChartData: { datasets: [] },
        areaChartData: { datasets: [] },
        radarChartData: { labels: [], datasets: [] },
        sunChartData: { datasets: [] },
        plotSpecificData: {},
      }

    // Filtrar datos por rango de tiempo
    const filteredData = filterDataByTimeRange(historyData)

    // Procesar datos para gráficos con mayor granularidad
    const processedData = processDataForCharts(filteredData)

    // Datos para gráfico de línea (temperatura con mínimos y máximos)
    const temperatureData = processedData.map((entry) => ({
      x: entry.date,
      y: Number(entry.temperature.toFixed(1)),
    }))

    // Datos de mínimos y máximos para temperatura
    const temperatureMinData = processedData.map((entry) => ({
      x: entry.date,
      y: Number(entry.min.temperature.toFixed(1)),
    }))

    const temperatureMaxData = processedData.map((entry) => ({
      x: entry.date,
      y: Number(entry.max.temperature.toFixed(1)),
    }))

    // Datos para gráfico de área (humedad y lluvia)
    const humidityData = processedData.map((entry) => ({
      x: entry.date,
      y: Number(entry.humidity.toFixed(1)),
    }))

    const rainData = processedData.map((entry) => ({
      x: entry.date,
      y: Number(entry.rain.toFixed(1)),
    }))

    // Datos para gráfico de barras (exposición solar)
    const sunData = processedData.map((entry) => ({
      x: entry.date,
      y: Number(entry.sun.toFixed(1)),
    }))

    // Calcular promedios usando los datos filtrados
    const calculateAverages = (data: HistoryPlot[]) => {
      const sums = data.reduce(
        (acc, entry) => {
          acc.sun += entry.sun
          acc.rain += entry.rain
          acc.humidity += entry.humidity
          acc.temperature += entry.temperature
          acc.count++
          return acc
        },
        { sun: 0, rain: 0, humidity: 0, temperature: 0, count: 0 },
      )

      return {
        sun: Number((sums.sun / sums.count).toFixed(1)),
        rain: Number((sums.rain / sums.count).toFixed(1)),
        humidity: Number((sums.humidity / sums.count).toFixed(1)),
        temperature: Number((sums.temperature / sums.count).toFixed(1)),
      }
    }

    // Agrupar datos por parcela
    const groupDataByPlot = (data: HistoryPlot[]) => {
      return data.reduce(
        (acc, entry) => {
          if (!acc[entry.plotId]) {
            acc[entry.plotId] = []
          }
          acc[entry.plotId].push(entry)
          return acc
        },
        {} as Record<number, HistoryPlot[]>,
      )
    }

    const plotData = groupDataByPlot(filteredData)
    const plotAverages: Record<number, any> = {}

    // Calcular promedios por parcela
    Object.entries(plotData).forEach(([plotId, data]) => {
      plotAverages[Number(plotId)] = calculateAverages(data)
    })

    const averages = calculateAverages(filteredData)

    // Crear datasets para el radar chart comparando parcelas
    const plotRadarDatasets = Object.entries(plotAverages).map(([plotId, avg], index) => {
      const colors = [
        { bg: "rgba(59, 130, 246, 0.2)", border: "#3B82F6" },
        { bg: "rgba(16, 185, 129, 0.2)", border: "#10B981" },
        { bg: "rgba(249, 115, 22, 0.2)", border: "#F97316" },
        { bg: "rgba(99, 102, 241, 0.2)", border: "#6366F1" },
        { bg: "rgba(236, 72, 153, 0.2)", border: "#EC4899" },
      ]

      const colorIndex = index % colors.length

      return {
        label: `Parcela ${plotId}`,
        data: [avg.sun, avg.rain, avg.humidity, avg.temperature],
        backgroundColor: colors[colorIndex].bg,
        borderColor: colors[colorIndex].border,
        pointBackgroundColor: colors[colorIndex].border,
      }
    })

    return {
      lineChartData: {
        datasets: [
          {
            label: "Temperatura (°C)",
            data: temperatureData,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
            pointRadius: 2,
            pointHoverRadius: 4,
          },
          {
            label: "Mínima",
            data: temperatureMinData,
            borderColor: "#93C5FD",
            backgroundColor: "transparent",
            borderDash: [5, 5],
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 3,
          },
          {
            label: "Máxima",
            data: temperatureMaxData,
            borderColor: "#2563EB",
            backgroundColor: "transparent",
            borderDash: [5, 5],
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 3,
          },
        ],
      },
      areaChartData: {
        datasets: [
          {
            label: "Humedad (%)",
            data: humidityData,
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
            tension: 0.3,
            pointRadius: 1,
            pointHoverRadius: 3,
          },
          {
            label: "Lluvia (mm)",
            data: rainData,
            borderColor: "#6366F1",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            fill: true,
            tension: 0.3,
            pointRadius: 1,
            pointHoverRadius: 3,
          },
        ],
      },
      sunChartData: {
        datasets: [
          {
            label: "Exposición solar (%)",
            data: sunData,
            backgroundColor: "rgba(251, 191, 36, 0.7)",
            borderColor: "#F59E0B",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      radarChartData: {
        labels: ["Sol (%)", "Lluvia (mm)", "Humedad (%)", "Temperatura (°C)"],
        datasets: [
          ...plotRadarDatasets,
          {
            label: "Promedio general",
            data: [averages.sun, averages.rain, averages.humidity, averages.temperature],
            backgroundColor: "rgba(107, 114, 128, 0.2)",
            borderColor: "#6B7280",
            pointBackgroundColor: "#6B7280",
          },
        ],
      },
      plotSpecificData: plotAverages,
    }
  }, [historyData, selectedTimeRange])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>
        {scrollbarStyles}
      </style>
      <main className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-bold text-3xl md:text-4xl mb-8 text-gray-800">Dashboard</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="py-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
                  <h2 className="font-bold text-2xl text-gray-800">Tus parcelas activas 📡</h2>
                  <p className="text-gray-600 mt-1">Visualiza la ubicación de tus parcelas activas en el sistema</p>
                </CardHeader>
                <CardBody className="overflow-hidden py-4 px-6">
                  <Map
                    className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg"
                    markers={activePlots.map((plot) => ({
                      lat: plot.lat,
                      lng: plot.lng,
                      label: plot.name,
                      status: plot.status,
                      location: plot.location,
                      manager: plot.manager,
                      cropType: plot.cropType,
                      lastWatering: plot.lastWatering,
                      id: plot.id,
                    }))}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <MeasureCard
                className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl"
                title="Intensidad del sol"
                value={`${sensorData.sun}%`}
                type="sun"
                numericValue={sensorData.sun}
              />
              <MeasureCard
                className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl"
                title="Temperatura"
                value={`${sensorData.temperature}°C`}
                type="temperature"
                numericValue={sensorData.temperature}
              />
              <MeasureCard
                className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl"
                title="Probabilidad de lluvia"
                value={`${sensorData.rain}%`}
                type="rain"
                numericValue={sensorData.rain}
              />
              <MeasureCard
                className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl"
                title="Humedad"
                value={`${sensorData.humidity}%`}
                type="humidity"
                numericValue={sensorData.humidity}
              />
            </div>
          </div>

          <div className="mt-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h2 className="font-bold text-2xl md:text-3xl text-gray-800">Histórico de Sensores</h2>

              <div className="flex items-center mt-4 md:mt-0 space-x-2 bg-white p-2 rounded-lg shadow">
                <span className="text-sm text-gray-600">Mostrar datos de:</span>
                <div className="flex space-x-1">
                  {["6h", "12h", "24h"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedTimeRange(range)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        selectedTimeRange === range
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
                  <h2 className="font-bold text-xl text-gray-800">Temperatura</h2>
                  <p className="text-gray-600 mt-1">Seguimiento de la temperatura en las últimas {selectedTimeRange}</p>
                </CardHeader>
                <CardBody className="h-[300px] px-6 overflow-auto custom-scrollbar">
                  <TemperatureChart data={lineChartData} />
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Leyenda:</p>
                    <p>• La línea muestra la temperatura promedio por hora</p>
                    <p>• Los puntos representan cada medición registrada</p>
                    <p>• Valores óptimos: 18-25°C para la mayoría de cultivos</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
                  <h2 className="font-bold text-xl text-gray-800">Humedad y Lluvia</h2>
                  <p className="text-gray-600 mt-1">
                    Análisis de humedad y precipitaciones en las últimas {selectedTimeRange}
                  </p>
                </CardHeader>
                <CardBody className="h-[300px] px-6 overflow-auto custom-scrollbar">
                  <HumidityRainChart data={areaChartData} />
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Leyenda:</p>
                    <p>
                      • <span className="text-emerald-500">Verde</span>: Humedad del suelo (%)
                    </p>
                    <p>
                      • <span className="text-indigo-500">Azul</span>: Precipitaciones (mm)
                    </p>
                    <p>• Las áreas sombreadas muestran la tendencia general</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
                  <h2 className="font-bold text-xl text-gray-800">Exposición Solar</h2>
                  <p className="text-gray-600 mt-1">Intensidad de luz solar en las últimas {selectedTimeRange}</p>
                </CardHeader>
                <CardBody className="h-[300px] px-6 overflow-auto custom-scrollbar">
                  <SunExposureChart data={sunChartData} />
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Leyenda:</p>
                    <p>• Las barras muestran el porcentaje de exposición solar</p>
                    <p>• Valores más altos indican mayor intensidad de luz</p>
                    <p>• Ideal: 60-80% para cultivos de alta demanda lumínica</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
                  <h2 className="font-bold text-xl text-gray-800">Comparativa por Parcela</h2>
                  <p className="text-gray-600 mt-1">Análisis comparativo de todas las parcelas activas</p>
                </CardHeader>
                <CardBody className="h-[300px] px-6 overflow-auto custom-scrollbar">
                  <AveragesRadarChart data={radarChartData} />
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Leyenda:</p>
                    <p>• Cada color representa una parcela diferente</p>
                    <p>• La línea gris muestra el promedio general</p>
                    <p>• Los valores son promedios de las últimas {selectedTimeRange}</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

