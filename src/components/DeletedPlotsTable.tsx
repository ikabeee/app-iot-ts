import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

export const columns = [
  { name: "ID", uid: "id" },
  { name: "ENCARGADO(A)", uid: "manager" },
  { name: "TIPO DE CULTIVO", uid: "cropType" },
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

interface DeletedPlotsTableProps {
  plots: Plot[];
}

export default function DeletedPlotsTable({ plots }: DeletedPlotsTableProps) {
  const renderCell = (plot: Plot, columnKey: keyof Plot) => {
    switch (columnKey) {
      case "id":
        return (
          <span className="font-mono">#{plot.id}</span>
        );
      case "manager":
        return (
          <div>
            <span>{plot.manager}</span>
            <p className="text-sm text-gray-500">{plot.name}</p>
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

  return (
    <Table aria-label="Tabla de parcelas eliminadas" className="shadow-lg">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="start" className="bg-gray-50">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={plots}>
        {(item) => (
          <TableRow key={item.id} className="hover:bg-gray-50">
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as keyof Plot)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
} 