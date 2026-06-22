import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { QRDTO } from "@/types";

import { QRStatusBadge } from "./qr-status-badge";
import { QRActionsDropdown } from "./qr-action-dropdown";

export function QRTable({ items }: { items: QRDTO[] }) {
  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">No QR codes found</div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scans</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((qr) => (
            <TableRow key={qr.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{qr.name}</p>

                  <p className="text-xs text-muted-foreground">{qr.token}</p>
                </div>
              </TableCell>

              <TableCell>
                <QRStatusBadge status={qr.status} />
              </TableCell>

              <TableCell>{qr.scanCount.toLocaleString()}</TableCell>

              <TableCell>
                {new Date(qr.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <QRActionsDropdown qr={qr} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
