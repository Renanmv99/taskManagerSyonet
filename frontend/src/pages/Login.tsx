import { Avatar, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
          setError("Credenciais inválidas.");
        } else {
          setError("Erro inesperado.");
        }
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/tasks");
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    }
  };


  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "secondary.main",
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




        </Box>
      </Paper>
    </Container>
  );
}
