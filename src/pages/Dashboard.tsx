import { useEffect, useState, useMemo } from "react";
import HistoryPlotService from "../services/HistoryPlotService";
import SensorService from "../services/SensorService";
import PlotService from "../services/PlotService";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Map from "../components/Map";
import MeasureCard from "../components/MeasureCard";
import TemperatureChart from "../components/charts/TemperatureChart";
import HumidityRainChart from "../components/charts/HumidityRainChart";
import AveragesRadarChart from "../components/charts/AveragesRadarChart";
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
} from "chart.js";
import 'chartjs-adapter-date-fns';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  RadialLinearScale,
  Filler
);

interface HistoryPlot {
  id: number;
  sun: number;
  rain: number;
  humidity: number;
  temperature: number;
  date: string;
  plotId: number;
}

interface SensorData {
  sun: number;
  rain: number;
  humidity: number;
  temperature: number;
}

interface Plot {
  id: number;
  lat: number;
  lng: number;
  name: string;
  status: string;
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    sun: 0,
    rain: 0,
    humidity: 0,
    temperature: 0,
  });

  const [historyData, setHistoryData] = useState<HistoryPlot[]>([]);
  const [activePlots, setActivePlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener datos del sensor original
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await SensorService.getSensors();
        const data = response.data;
        const latestData = data.sort((a: HistoryPlot, b: HistoryPlot) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        setSensorData({
          sun: latestData.sun,
          rain: latestData.rain,
          humidity: latestData.humidity,
          temperature: latestData.temperature,
        });
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchSensorData();
  }, []);

  // Obtener datos históricos para gráficos
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await HistoryPlotService.getAllHistoryPlot();
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };
    fetchHistoryData();
  }, []);

  // Obtener parcelas activas para el mapa
  useEffect(() => {
    const fetchActivePlots = async () => {
      try {
        const response = await PlotService.getAllPlots();
        const active = response.data.filter((plot: Plot) => plot.status === "ACTIVE");
        setActivePlots(active);
      } catch (error) {
        console.error("Error fetching active plots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivePlots();
  }, []);

  // Procesar datos para gráficos
  const { lineChartData, areaChartData, radarChartData } = useMemo(() => {
    if (historyData.length === 0) return {
      lineChartData: { datasets: [] },
      areaChartData: { datasets: [] },
      radarChartData: { labels: [], datasets: [] }
    };

    // Ordenar por fecha (más antiguo primero)
    const sortedData = [...historyData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Obtener datos del último día disponible
    const latestDate = new Date(sortedData[sortedData.length - 1].date);
    latestDate.setHours(0, 0, 0, 0);
    
    const todayData = sortedData.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= latestDate;
    });

    if (todayData.length === 0) {
      console.log("No hay datos disponibles");
      return {
        lineChartData: { datasets: [] },
        areaChartData: { datasets: [] },
        radarChartData: { labels: [], datasets: [] }
      };
    }

    // Agrupar datos por hora para reducir la cantidad de puntos
    const groupedByHour = todayData.reduce((acc, entry) => {
      const date = new Date(entry.date);
      const hourKey = date.getHours();
      
      if (!acc[hourKey]) {
        acc[hourKey] = {
          date: date,
          temperature: entry.temperature,
          humidity: entry.humidity,
          rain: entry.rain,
          count: 1
        };
      } else {
        acc[hourKey].temperature = (acc[hourKey].temperature * acc[hourKey].count + entry.temperature) / (acc[hourKey].count + 1);
        acc[hourKey].humidity = (acc[hourKey].humidity * acc[hourKey].count + entry.humidity) / (acc[hourKey].count + 1);
        acc[hourKey].rain = (acc[hourKey].rain * acc[hourKey].count + entry.rain) / (acc[hourKey].count + 1);
        acc[hourKey].count++;
      }
      
      return acc;
    }, {} as Record<number, { date: Date; temperature: number; humidity: number; rain: number; count: number; }>);

    // Convertir datos agrupados a arrays para los gráficos
    const hourlyData = Object.entries(groupedByHour)
      .sort(([hourA], [hourB]) => Number(hourA) - Number(hourB))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_, data]) => data);

    console.log("Datos procesados por hora:", hourlyData);

    // Datos para gráfico de línea (temperatura por hora)
    const temperatureData = hourlyData.map(entry => ({
      x: entry.date,
      y: Number(entry.temperature.toFixed(1))
    }));

    // Datos para gráfico de área (humedad y lluvia por hora)
    const humidityRainData = hourlyData.map(entry => ({
      x: entry.date,
      humidity: Number(entry.humidity.toFixed(1)),
      rain: Number(entry.rain.toFixed(1))
    }));

    // Calcular promedios usando TODOS los datos históricos
    const calculateAverages = (data: HistoryPlot[]) => {
      const sums = data.reduce((acc, entry) => {
        acc.sun += entry.sun;
        acc.rain += entry.rain;
        acc.humidity += entry.humidity;
        acc.temperature += entry.temperature;
        acc.count++;
        return acc;
      }, { sun: 0, rain: 0, humidity: 0, temperature: 0, count: 0 });

      return {
        sun: sums.sun / sums.count,
        rain: sums.rain / sums.count,
        humidity: sums.humidity / sums.count,
        temperature: sums.temperature / sums.count
      };
    };

    const averages = calculateAverages(historyData);

    return {
      lineChartData: {
        datasets: [{
          label: "Temperatura (°C)",
          data: temperatureData,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      areaChartData: {
        datasets: [
          {
            label: "Humedad (%)",
            data: humidityRainData.map(d => ({ x: d.x, y: d.humidity })),
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
            tension: 0.3
          },
          {
            label: "Lluvia (mm)",
            data: humidityRainData.map(d => ({ x: d.x, y: d.rain })),
            borderColor: "#6366F1",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            fill: true,
            tension: 0.3
          }
        ]
      },
      radarChartData: {
        labels: ["Sol (%)", "Lluvia (mm)", "Humedad (%)", "Temperatura (°C)"],
        datasets: [{
          label: "Promedios (todos los datos)",
          data: [
            averages.sun,
            averages.rain,
            averages.humidity,
            averages.temperature
          ],
          backgroundColor: "rgba(249, 115, 22, 0.2)",
          borderColor: "#F97316",
          pointBackgroundColor: "#F97316"
        }]
      }
    };
  }, [historyData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-3xl md:text-4xl mb-8 text-gray-800">Dashboard</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="py-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
                <h2 className="font-bold text-2xl text-gray-800">Tus parcelas activas 📡</h2>
                <p className="text-gray-600 mt-1">Visualiza la ubicación de tus parcelas en tiempo real</p>
              </CardHeader>
              <CardBody className="overflow-hidden py-4 px-6">
                <Map 
                  className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg" 
                  markers={activePlots.map(plot => ({
                    lat: plot.lat,
                    lng: plot.lng,
                    label: plot.name
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
          <h2 className="font-bold text-2xl md:text-3xl mb-8 text-gray-800">Histórico de Parcelas</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
                <h2 className="font-bold text-xl text-gray-800">Temperatura últimos 30 días</h2>
                <p className="text-gray-600 mt-1">Seguimiento de la temperatura en tus parcelas</p>
              </CardHeader>
              <CardBody className="h-[300px] px-6">
                <TemperatureChart data={lineChartData || { datasets: [] }} />
              </CardBody>
            </Card>

            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
                <h2 className="font-bold text-xl text-gray-800">Humedad y Lluvia</h2>
                <p className="text-gray-600 mt-1">Análisis de humedad y probabilidad de lluvia</p>
              </CardHeader>
              <CardBody className="h-[300px] px-6">
                <HumidityRainChart data={areaChartData || { datasets: [] }} />
              </CardBody>
            </Card>
          </div>

          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
            <CardHeader className="pb-2 pt-4 px-6 flex-col items-start">
              <h2 className="font-bold text-xl text-gray-800">Promedios generales</h2>
              <p className="text-gray-600 mt-1">Análisis completo de todos los datos históricos</p>
            </CardHeader>
            <CardBody className="h-[300px] px-6">
              <AveragesRadarChart data={radarChartData || { labels: [], datasets: [] }} />
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}