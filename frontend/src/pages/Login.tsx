import { Alert, Avatar, Box, Button, Container, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import type { SnackbarState } from "./Register";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      showSnackbar("Email é obrigatório!", "error");
      return;
    }

    if (!password.trim()) {
      showSnackbar("Senha é obrigatória!", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        if (res.status === 401) {
          showSnackbar("Credenciais inválidas!", "error");
        } else {
          showSnackbar("Erro inesperado!", "error");
        }
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/tasks");
    } catch (err) {
      showSnackbar("Erro ao conectar com servidor!", "error");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "primary.main",
            textAlign: "center",
            mb: 1,
          }}
        >
          <AddTaskOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            placeholder="Email"
            fullWidth
            value={email}
            type="email"
            required
            autoFocus
            sx={{ mb: 2 }}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            placeholder="Senha"
            fullWidth
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Entrar
          </Button>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mt: 2
          }}>

            <Typography>
              Não tem uma conta?
            </Typography>
            <Button
              onClick={() => navigate("/register")}
            >
              Registrar
            </Button>
          </Box>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={closeSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Paper>
    </Container>
  );
}