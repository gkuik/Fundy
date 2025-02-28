import React, { FC, useState } from "react";
import { Expense } from "../Models/Expense";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";
import API from "../api";
import { useNavigate } from "react-router-dom";

const AddExpenseForm: FC = () => {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = { recipient, description, amount };
    API.post("/expense", newExpense).then(() => {
      navigate("/expense");
    });
  };

  return (
    <Paper sx={{ padding: 3, maxWidth: 400, margin: "auto" }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(-1)}
        sx={{ marginBottom: 2 }}
      >
        Retour
      </Button>

      <Typography variant="h5" gutterBottom>
        Ajouter une Dépense
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          required
          id="recipient"
          label="Destinataire"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          fullWidth
        />
        <TextField
          required
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <TextField
          required
          id="amount"
          label="Montant (€)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
          Ajouter
        </Button>
      </Box>
    </Paper>
  );
};

export default AddExpenseForm;
