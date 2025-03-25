import { Card, CardBody, CardHeader } from "@heroui/card";
import Map from "../components/Map";
import MeasureCard from "../components/MeasureCard";
import { Sun, Thermometer, GlassWater, CloudRainWind } from "lucide-react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            },
            {
                label: 'Dataset 2',
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: 'rgba(153,102,255,1)',
                backgroundColor: 'rgba(153,102,255,0.2)',
            },
            {
                label: 'Dataset 3',
                data: [18, 48, 77, 9, 100, 27, 40],
                borderColor: 'rgba(255,159,64,1)',
                backgroundColor: 'rgba(255,159,64,0.2)',
            },
        ],
    };

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

                {/* Measure Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center">
                    <MeasureCard className="w-full h-[150px] mb-0 shadow-medium" icon={Sun} title="Intensidad del sol" value="10%" />
                    <MeasureCard className="w-full h-[150px] shadow-medium" icon={Thermometer} title="Temperatura" value="10%" />
                    <MeasureCard className="w-full h-[150px] shadow-medium" icon={CloudRainWind} title="Probabilidad de lluvia" value="10%" />
                    <MeasureCard className="w-full h-[150px] shadow-medium" icon={GlassWater} title="Humedad" value="10%" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Card className="shadow-small w-full">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <h2 className="font-bold text-[24px]">Chart 1</h2>
                        </CardHeader>
                        <CardBody className="overflow-hidden py-2">
                            <Line data={data} />
                        </CardBody>
                    </Card>
                    <Card className="shadow-small w-full">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <h2 className="font-bold text-[24px]">Chart 2</h2>
                        </CardHeader>
                        <CardBody className="overflow-hidden py-2">
                            <Line data={data} />
                        </CardBody>
                    </Card>
                    <Card className="shadow-small w-full">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <h2 className="font-bold text-[24px]">Chart 3</h2>
                        </CardHeader>
                        <CardBody className="overflow-hidden py-2">
                            <Line data={data} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </main>
    )
}