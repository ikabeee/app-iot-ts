import { useEffect, useState } from "react";
import Map from "../components/Map";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import PlotService from "../services/PlotService";

export const columns = [
  { name: "NOMBRE", uid: "name" },
  { name: "TIPO", uid: "cropType" },
  { name: "UBICACIÓN", uid: "location" },
  { name: "ESTADO", uid: "status" },
];

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

  const renderCell = (plot: Plot, columnKey: keyof Plot) => {
    switch (columnKey) {
      case "name":
        return (
          <div>
            <span>{plot.name}</span>
            <p className="text-sm text-gray-500">{plot.manager}</p>
          </div>
        );
      case "cropType":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{plot.cropType}</p>
          </div>
        );
      case "location":
        return (
          <p className="text-bold text-sm capitalize text-default-400">
            {plot.location}
          </p>
        );
      case "status":
        return (
          <span className="text-sm text-red-500 capitalize">
            {plot.status.toLowerCase()}
          </span>
        );
      default:
        return plot[columnKey];
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
      <h1 className="font-bold text-[28px] mb-6 text-start">Parcelas Eliminadas</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
        {/* Mapa más grande - ahora ocupa 2/3 del espacio */}
        <div className="lg:w-2/3 h-full">
          <div className="h-full rounded-xl overflow-hidden shadow-lg">
            <Map 
              className="w-full h-full"
              markers={plots.map(plot => ({
                lat: plot.lat,
                lng: plot.lng,
                label: plot.name,
                color: 'red'
              }))}
            />
          </div>
        </div>
        
        {/* Tabla - ahora ocupa 1/3 del espacio con scroll */}
        <div className="lg:w-1/3 h-full overflow-hidden flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <Table aria-label="Tabla de parcelas eliminadas">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid} align="start">
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={plots}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey as keyof Plot)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}