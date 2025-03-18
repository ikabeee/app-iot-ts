import { Card, CardBody, CardHeader } from "@heroui/card";
import Map from "../components/Map";
import MeasureCard from "../components/MeasureCard";
import { Sun, Thermometer, GlassWater, CloudRainWind } from "lucide-react";

export default function Dashboard() {
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
                <div className="grid grid-cols-2 grid-rows-2 gap-4 justify-center items-center">
                    <MeasureCard className="w-full h-[150px] mb-0 shadow-medium" icon={Sun} title="Intensidad del sol" value="10%" />
                    <MeasureCard className="w-full h-[150px] shadow-medium" icon={Thermometer} title="Temperatura" value="10%" />
                    <MeasureCard className="w-full h-[150px] shadow-medium" icon={CloudRainWind} title="Probabilidad de lluvia" value="10%" />
                    <MeasureCard className="w-full h-[150px] shadow-medium" icon={GlassWater} title="Humedad" value="10%" />
                </div>
            </div>
        </main>

    )
}