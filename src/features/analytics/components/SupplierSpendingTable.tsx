import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../../shared/lib/formatters";
import { useSupplierSpending } from "../hooks/useSupplierSpending";

export function SupplierSpendingTable(): JSX.Element {
  const { data, isLoading, isError } = useSupplierSpending();

  if (isLoading) {
    return <Typography>טוען נתוני הוצאות לספקים...</Typography>;
  }
  if (isError) {
    return <Alert severity="error">לא ניתן לטעון נתוני הוצאות לספקים.</Alert>;
  }
  if (!data || data.length === 0) {
    return <Alert severity="info">עדיין אין נתונים להצגה.</Alert>;
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, textAlign: "start", direction: "rtl" }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700, textAlign: "start" }}>
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
            {data.map((row) => (
              <TableRow key={row.supplierName}>
                <TableCell>{row.supplierName}</TableCell>
                <TableCell>{formatCurrency(row.totalSpent)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
