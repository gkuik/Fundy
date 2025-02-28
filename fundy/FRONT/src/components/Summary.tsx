import React, { useCallback, useEffect, useState } from "react";
import API from "../api";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2"
import { Summary } from "../Models/Summary";

const SummaryScreen: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    try {
      const summary = await API.get<Summary>("/summary");
      setSummary(summary.data);
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err);
      setError("Impossible de charger les données. Veuillez réessayer plus tard.");
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return summary && (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom>Répartition des Dépenses</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" whiteSpace="nowrap">Total des Revenus</Typography>
              {summary.incomes.total} €
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" whiteSpace="nowrap">Total des Dépenses</Typography>
              {summary.expenses.total} €
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {summary.incomes.total === 0 ? (
        <Alert severity="warning">Aucun revenu n'a été enregistré. Impossible de répartir les dépenses.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Membre</TableCell>
                <TableCell align="right">Part</TableCell>
                <TableCell align="right">Montant à payer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.incomes.list.map(({ id, name, part, partPercent }) => (
                <TableRow key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell align="right">{partPercent} %</TableCell>
                  <TableCell align="right">{part} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SummaryScreen;
