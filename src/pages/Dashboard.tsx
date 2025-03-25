import { useEffect, useState, useMemo } from "react";
import HistoryPlotService from "../services/HistoryPlotService";
import SensorService from "../services/SensorService";
import PlotService from "../services/PlotService";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Map from "../components/Map";
import MeasureCard from "../components/MeasureCard";
import { Sun, Thermometer, GlassWater, CloudRainWind } from "lucide-react";
import { Line, Radar } from "react-chartjs-2";
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
        const latestData = data.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
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
    if (historyData.length === 0) return {};

    // Ordenar por fecha (más reciente primero)
    const sortedData = [...historyData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Datos para gráfico de línea (temperatura últimos 30 días)
    const last30DaysData = sortedData.slice(0, 30).reverse();
    const temperatureData = last30DaysData.map(entry => ({
      x: new Date(entry.date),
      y: entry.temperature
    }));

    // Datos para gráfico de área (humedad y lluvia últimos 30 días)
    const humidityRainData = last30DaysData.map(entry => ({
      x: new Date(entry.date),
      humidity: entry.humidity,
      rain: entry.rain
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
          tension: 0.3
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
            label: "Lluvia (%)",
            data: humidityRainData.map(d => ({ x: d.x, y: d.rain })),
            borderColor: "#6366F1",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            fill: true,
            tension: 0.3
          }
        ]
      },
      radarChartData: {
        labels: ["Sol", "Lluvia", "Humedad", "Temperatura"],
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

  // Opciones para gráficos
  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'PP',
          displayFormats: { day: 'MMM d' }
        }
      },
      y: { beginAtZero: true }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <h1 className="font-bold text-[28px] mb-4 text-start">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3 justify-center items-center">
        <div className="md:col-span-2">
          <Card className="py-4 shadow-small w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="font-bold text-[24px]">Tus parcelas activas 📡</h2>
            </CardHeader>
            <CardBody className="overflow-hidden py-2">
              <Map 
                className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg" 
                markers={activePlots.map(plot => ({
                  lat: plot.lat,
                  lng: plot.lng,
                  label: plot.name
                }))}
              />
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center">
          <MeasureCard
            className="w-full h-[150px] mb-0 shadow-medium"
            icon={Sun}
            title="Intensidad del sol"
            value={`${sensorData.sun}%`}
          />
          <MeasureCard
            className="w-full h-[150px] shadow-medium"
            icon={Thermometer}
            title="Temperatura"
            value={`${sensorData.temperature}°C`}
          />
          <MeasureCard
            className="w-full h-[150px] shadow-medium"
            icon={CloudRainWind}
            title="Probabilidad de lluvia"
            value={`${sensorData.rain}%`}
          />
          <MeasureCard
            className="w-full h-[150px] shadow-medium"
            icon={GlassWater}
            title="Humedad"
            value={`${sensorData.humidity}%`}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-[24px] mb-4">Histórico de Parcelas</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-4 shadow-small">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="font-bold text-[20px]">Temperatura últimos 30 días</h2>
            </CardHeader>
            <CardBody className="h-[300px]">
              <Line
                data={lineChartData || { datasets: [] }}
                options={timeChartOptions}
              />
            </CardBody>
          </Card>

          <Card className="p-4 shadow-small">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="font-bold text-[20px]">Humedad y Lluvia</h2>
            </CardHeader>
            <CardBody className="h-[300px]">
              <Line
                data={areaChartData || { datasets: [] }}
                options={{
                  ...timeChartOptions,
                  scales: {
                    ...timeChartOptions.scales,
                    y: { max: 100, beginAtZero: true }
                  }
                }}
              />
            </CardBody>
          </Card>
        </div>

        <Card className="p-4 shadow-small">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h2 className="font-bold text-[20px]">Promedios generales (todos los datos)</h2>
          </CardHeader>
          <CardBody className="h-[300px]">
            <Radar
              data={radarChartData || { labels: [], datasets: [] }}
              options={radarOptions}
            />
          </CardBody>
        </Card>
      </div>
    </main>
  );
}