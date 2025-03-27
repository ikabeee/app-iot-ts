import { useEffect, useState } from "react";
import Map from "../components/Map";
import PlotService from "../services/PlotService";
import DeletedPlotsTable from "../components/DeletedPlotsTable";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

type Plot = {
  id: number;
  name: string;
  location: string;
  manager: string;
  cropType: string;
  lastWatering: string;
  lat: number;
  lng: number;
  status: string;
  userId: number | null;
};

export default function DeletedPlots() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeletedPlots = async () => {
      try {
        const response = await PlotService.getPlotsDeleted();
        setPlots(response.data.plotsDeleted);
      } catch (error) {
        console.error("Error fetching deleted plots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedPlots();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="font-bold text-3xl text-gray-800">Parcelas Eliminadas</h1>
        <p className="text-gray-600 mt-2">
          Visualiza y gestiona las parcelas que han sido eliminadas del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody className="p-0">
            <div className="h-[600px]">
              <Map 
                className="w-full h-full rounded-xl overflow-hidden"
                markers={plots.map(plot => ({
                  lat: plot.lat,
                  lng: plot.lng,
                  label: plot.name,
                  color: 'red',
                  status: plot.status
                }))}
              />
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-1">
          <CardBody>
            <div className="overflow-x-auto">
              <DeletedPlotsTable plots={plots} />
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}