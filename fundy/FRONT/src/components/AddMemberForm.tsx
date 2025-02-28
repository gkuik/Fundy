import React, { useState, FC, FormEvent } from "react";
import { Member } from "../Models/Member";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField } from "@mui/material";

const AddMemberForm: FC = (props) => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [income, setIncome] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || income <= 0) {
      setError("Le nom et le revenu doivent être valides.");
      return;
    }
    API.post("/member", { name, income }).then((response) => {
      navigate("/members");
    })
  };

  return (
    <Paper elevation={1}>
      <h3>Ajouter un Membre</h3>
      <form onSubmit={handleSubmit}>
        <TextField required id="name" label="Nom" value={name} onChange={(e) => setName(e.target.value)}/>
        <TextField required id="income" label="Income" value={income}
                   onChange={(e) => setIncome(Number(e.target.value))}/>
        <button type="submit">Ajouter</button>
      </form>
    </Paper>

  );
};

export default AddMemberForm;
