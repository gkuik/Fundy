import React, { ChangeEvent, useEffect, useState } from "react";
import { Expense, ExpenseApiResponse } from "../Models/Expense";
import API from "../api";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField,
  Typography
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ExpenseList: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<ExpenseApiResponse[]>([]);
  const [tempExpense, setTempExpense] = useState<ExpenseApiResponse | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    API.get<ExpenseApiResponse[]>("/expense").then((response) => {
      setExpenses(response.data);
    });
  };

  const handleAddExpense = () => {
    navigate("/expense/new");
  }

  const handleRemove = (id: number) => {
    API.delete(`/expense/${id}`).then(() => {
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id))
    })
  };

  const startEditing = (expense: ExpenseApiResponse) => {
    setTempExpense(expense)
  };

  const updateExpense = () => {
    if (!tempExpense) return;
    const { recipient, description, amount, id } = tempExpense;
    API.put(`/expense/${id}`, { recipient, description, amount }).then((response) => {
      setExpenses((prevExpenses) => prevExpenses.map((expense) =>
        expense.id === id ? response.data : expense
      ));
      setTempExpense(null);
    });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempExpense((prevState) =>
      prevState ? { ...prevState, [name]: value } : prevState
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Dépenses
      </Typography>

      <Button variant="contained" onClick={handleAddExpense}>
        Ajouter une dépense
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Destinataire</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Montant</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                {expense.id === tempExpense?.id ? (
                  <>
                    <TableCell>
                      <TextField
                        size="small"
                        value={tempExpense.recipient}
                        name="recipient"
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={tempExpense.description}
                        name="description"
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        value={tempExpense.amount}
                        name="amount"
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button onClick={() => updateExpense()} color="primary">Valider</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      {expense.recipient}
                    </TableCell>
                    <TableCell>
                      {expense.description}
                    </TableCell>
                    <TableCell align="right">
                      {Number(expense.amount).toFixed(2)} €
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => startEditing(expense)}>
                        <Edit/>
                      </IconButton>
                      <IconButton color="error" onClick={() => handleRemove(expense.id)}>
                        <Delete/>
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExpenseList;
