import Map from "../components/Map";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import React, { SVGProps } from "react";
import PlotService from "../services/PlotService";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
];

const statusColorMap: Record<string, string> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

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
  const [plots, setPlots] = React.useState<Plot[]>([]);

  // Fetch the deleted plots
  React.useEffect(() => {
    const fetchDeletedPlots = async () => {
      const response = await PlotService.getPlotsDeleted();
      setPlots(response.data.plotsDeleted);
    };

    fetchDeletedPlots();
  }, []);

  const renderCell = React.useCallback((plot: Plot, columnKey: React.Key) => {
    const cellValue = plot[columnKey as keyof Plot];

    switch (columnKey) {
      case "name":
        return (
          <div>
            <span>{plot.name}</span>
            <p className="text-sm text-gray-500">{plot.manager}</p>
          </div>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{plot.cropType}</p>
            <p className="text-bold text-sm capitalize text-default-400">{plot.location}</p>
          </div>
        );
      case "status":
        return (
          <span className={`text-sm text-${statusColorMap[plot.status]}`}>
            {plot.status}
          </span>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <main className="min-h-screen p-4">
      <h1 className="font-bold text-[28px] mb-4 text-start">Parcelas Eliminadas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col h-full">
          <Map className="w-full h-full rounded-xl overflow-hidden shadow-lg" />
        </div>
        <div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "status" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={plots}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
