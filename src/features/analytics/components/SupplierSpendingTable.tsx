import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSupplierSpending } from "../hooks/useSupplierSpending";

export function SupplierSpendingTable(): JSX.Element {
  const { data, isLoading } = useSupplierSpending();

  if (isLoading) {
    return <Typography>טוען נתוני הוצאות לספקים...</Typography>;
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, textAlign: "right", direction: "rtl" }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700, textAlign: "right" }}>
        הוצאות לפי ספק
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ספק</TableCell>
              <TableCell>סה״כ הוצאה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((row) => (
              <TableRow key={row.supplierName}>
                <TableCell>{row.supplierName}</TableCell>
                <TableCell>${row.totalSpent.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
