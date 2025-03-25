import { useEffect, useState, useMemo } from "react";
import HistoryPlotService from "../services/HistoryPlotService";
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
  ChartData,
  ChartOptions,
  Filler,
} from "chart.js";

// Registrar todos los componentes necesarios
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

// Tipos para los datos del sensor
interface SensorData {
  sun: number;
  rain: number;
  humidity: number;
  temperature: number;
}

// Tipo para los datos históricos de la parcela
interface HistoryPlot {
  id: number;
  sun: number;
  rain: number;
  humidity: number;
  temperature: number;
  date: string;
  plotId: number;
}

// Tipos para los datos de los gráficos
interface ChartDataSets {
  label: string;
  data: { x: Date; y: number }[] | number[];
  borderColor: string;
  backgroundColor: string;
  fill?: boolean;
}

interface LineChartData extends ChartData<"line"> {
  datasets: ChartDataSets[];
}

interface RadarChartData extends ChartData<"radar"> {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    pointBackgroundColor: string;
  }[];
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    sun: 0,
    rain: 0,
    humidity: 0,
    temperature: 0,
  });
  const [historyData, setHistoryData] = useState<HistoryPlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Procesamiento de datos para gráficos
  const { lineChartData, radarChartData, areaChartData } = useMemo(() => {
    const initialData = {
      lineChartData: {} as LineChartData,
      radarChartData: {} as RadarChartData,
      areaChartData: {} as LineChartData,
    };

    if (!historyData.length) return initialData;

    // Datos para gráfico de líneas (Temperatura)
    const temperatureData = historyData.map((entry) => ({
      x: new Date(entry.date),
      y: entry.temperature,
    }));

    // Datos para gráfico de radar (Promedios)
    const averages = historyData.reduce(
      (acc, entry) => {
        acc.sun += entry.sun;
        acc.rain += entry.rain;
        acc.humidity += entry.humidity;
        acc.temperature += entry.temperature;
        return acc;
      },
      { sun: 0, rain: 0, humidity: 0, temperature: 0 }
    );

    const count = historyData.length;
    const radarValues = [
      averages.sun / count,
      averages.rain / count,
      averages.humidity / count,
      averages.temperature / count,
    ];

    // Datos para gráfico de área (Lluvia y Humedad)
    const rainHumidityData = historyData.map((entry) => ({
      x: new Date(entry.date),
      rain: entry.rain,
      humidity: entry.humidity,
    }));

    return {
      lineChartData: {
        datasets: [
          {
            label: "Temperatura (°C)",
            data: temperatureData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
          },
        ],
      },
      radarChartData: {
        labels: ["Sol", "Lluvia", "Humedad", "Temperatura"],
        datasets: [
          {
            label: "Promedio",
            data: radarValues,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            pointBackgroundColor: "rgba(54, 162, 235, 1)",
          },
        ],
      },
      areaChartData: {
        datasets: [
          {
            label: "Lluvia (%)",
            data: rainHumidityData.map((d) => ({ x: d.x, y: d.rain })),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
          {
            label: "Humedad (%)",
            data: rainHumidityData.map((d) => ({ x: d.x, y: d.humidity })),
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            fill: true,
          },
        ],
      },
    };
  }, [historyData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await HistoryPlotService.getAllHistoryPlot();
        const data: HistoryPlot[] = response.data;

        if (data.length > 0) {
          const sortedData = data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setHistoryData(sortedData);
          setSensorData({
            sun: sortedData[0].sun,
            rain: sortedData[0].rain,
            humidity: sortedData[0].humidity,
            temperature: sortedData[0].temperature,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos de los sensores");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Configuración base para los gráficos
  const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  // Opciones para gráficos de tiempo
  const timeChartOptions = (title: string): ChartOptions<"line"> => ({
    ...chartConfig,
    plugins: {
      ...chartConfig.plugins,
      title: { display: true, text: title },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "day", tooltipFormat: "PP" },
        title: { display: true, text: "Fecha" },
      },
      y: { title: { display: true, text: "Valor" } },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  });

  const radarOptions: ChartOptions<"radar"> = {
    ...chartConfig,
    scales: {
      r: {
        beginAtZero: true,
        ticks: { stepSize: 20 },
        pointLabels: { font: { size: 14 } },
      },
    },
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando datos de sensores...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-4 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <h1 className="font-bold text-[28px] mb-4 text-start">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3 justify-center items-center">
        <div className="md:col-span-2">
          <Card className="py-4 shadow-small w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="font-bold text-[24px]">Tus sensores 📡</h2>
            </CardHeader>
            <CardBody className="overflow-hidden py-2">
              <Map className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg" />
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 md:col-span-3">
          <Card className="shadow-small w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="font-bold text-[20px]">Temperatura Histórica</h2>
            </CardHeader>
            <CardBody className="overflow-hidden py-2 h-[300px]">
              {lineChartData?.datasets && (
                <Line
                  id="temperatureChart"
                  data={lineChartData}
                  options={timeChartOptions("Variación de temperatura")}
                  redraw={true}
                />
              )}
            </CardBody>
          </Card>

          <Card className="shadow-small w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="font-bold text-[20px]">Promedio de Variables</h2>
            </CardHeader>
            <CardBody className="overflow-hidden py-2 h-[300px]">
              {radarChartData?.datasets && (
                <Radar
                  id="averagesRadar"
                  data={radarChartData}
                  options={radarOptions}
                  redraw={true}
                />
              )}
            </CardBody>
          </Card>

          <Card className="shadow-small w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="font-bold text-[20px]">Humedad vs Lluvia</h2>
            </CardHeader>
            <CardBody className="overflow-hidden py-2 h-[300px]">
              {areaChartData?.datasets && (
                <Line
                  id="humidityRainChart"
                  data={areaChartData}
                  options={timeChartOptions("Relación Humedad/Lluvia")}
                  redraw={true}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}