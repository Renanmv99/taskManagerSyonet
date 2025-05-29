import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/user/exists");
        if (res.ok) {
          const data = await res.json();
          if (!data.hasUsers) {
            setAdmin(true);
          } else {
            setAdmin(false);
          }
        } else {
          setError("Erro ao verificar usuários existentes.");
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor.");
      }
    };

    checkUsers();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, admin })
      });

      if (res.status === 201) {
        navigate("/");
      } else if (res.status === 409) {
        setError("Email já cadastrado.");
      } else {
        setError("Erro inesperado.");
      }
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
          Registro
        </Typography>

        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            value={name}
            placeholder="Nome completo"
            required
            autoFocus
            sx={{ mb: 2 }}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            placeholder="Email"
            fullWidth
            required
            type="email"
            value={email}
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

          {admin && (
            <FormControlLabel
              control={<Checkbox checked disabled color="primary" />}
              label="Administrador"
            />
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Registrar
          </Button>
        </Box>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mt: 2,
          }}
        >
          <Typography>Já tem uma conta?</Typography>
          <Button onClick={() => navigate("/")}>Fazer Login</Button>
        </Box>
      </Paper>
    </Container>
  );
}
