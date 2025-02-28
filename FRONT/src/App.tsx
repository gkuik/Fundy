import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import MemberList from "./components/MemberList";
import ExpenseList from "./components/ExpenseList";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container
} from "@mui/material";
import AddMemberForm from "./components/AddMemberForm";
import AddExpenseForm from "./components/AddExpenseForm";
import Summary from "./components/Summary";
import SummaryScreen from "./components/Summary";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
});

// Composant du menu de navigation
const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Fundy
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>Résumé</Button>
        <Button color="inherit" onClick={() => navigate("/expense")}>Dépenses</Button>
        <Button color="inherit" onClick={() => navigate("/members")}>Membres</Button>
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Router>
        <NavigationBar/>
        <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", color: "text.primary", padding: 3 }}>
          <Container>
            <Routes>
              <Route path="/" element={<SummaryScreen/>}/>
              <Route path="/expense" element={<ExpenseList/>}/>
              <Route path="/expense/new" element={<AddExpenseForm/>}/>
              <Route path="/members" element={<MemberList/>}/>
              <Route path="/members/new" element={<AddMemberForm/>}/>
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
