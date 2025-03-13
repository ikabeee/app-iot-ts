import { Card, CardBody, CardHeader } from "@heroui/card";
import Map from "../components/Map";
import MeasureCard from "../components/MeasureCard";

export default function Dashboard() {
    return (
        <main>
            <Card className="py-4 shadow-small w-full h-[500px]">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h2 className="font-bold text-large">Tus sensores 📡</h2>
                </CardHeader>
                <CardBody className="overflow-hidden py-2">
                    <Map className="w-full h-[100%] rounded-xl overflow-hidden" />
                </CardBody>
            </Card>
            <div className="flex">
                <MeasureCard />
            </div>
        </main>
    )
}