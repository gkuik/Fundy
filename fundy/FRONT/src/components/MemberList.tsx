import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Member, MemberApiResponse } from "../Models/Member";
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
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<MemberApiResponse[]>([]);
  const [tempMember, setTempMember] = useState<MemberApiResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    API.get<MemberApiResponse[]>("/member")
      .then((response) => {
        setMembers(response.data);
      });
  };

  const handleRemove = (id?: number) => {
    if (!id) return;
    API.delete(`/member/${id}`).then(() => {
      console.log(`Membre supprimé : ID ${id}`);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempMember((prevState) =>
      prevState ? { ...prevState, [name]: value } : prevState
    );
  };

  const startEditing = (member: MemberApiResponse) => {
    setTempMember(member);
  };

  const updateMember = () => {
    if (tempMember === null) return;
    const { id, name, income } = tempMember;
    API.put(`/member/${id}`, { name, income })
      .then((member) => {
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? member.data : m))
        );
        setTempMember(null);
      })
      .catch((err) => console.error("Erreur de mise à jour", err));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Membres
      </Typography>

      <Button variant="contained" onClick={() => navigate("/members/new")}>Ajouter un membre</Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nom</strong></TableCell>
              <TableCell align="center"><strong>Revenus</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                {tempMember?.id === member.id ? (
                  <>
                    <TableCell>
                      <TextField
                        size="small"
                        name="name"
                        value={tempMember.name}
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        name="income"
                        value={tempMember.income}
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={updateMember} color="primary">Valider</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{member.name}</TableCell>
                    <TableCell align="center">{member.income.toFixed(2)} €</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => startEditing(member)}>
                        <Edit/>
                      </IconButton>
                      <IconButton color="error" onClick={() => handleRemove(member.id)}>
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

export default MemberList;
