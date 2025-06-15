import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success"
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
          showSnackbar("Erro ao verificar usuários!", "error");
        }
      } catch (err) {
        showSnackbar("Erro ao conectar com servidor!", "error");
      }
    };

    checkUsers();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      showSnackbar("Nome é obrigatório!", "error");
      return;
    }

    if (!email.trim()) {
      showSnackbar("Email é obrigatório!", "error");
      return;
    }

    if (!validateEmail(email)) {
      showSnackbar("Email precisa ser válido!", "error");
      return;
    }

    if (!password.trim()) {
      showSnackbar("Senha é obrigatória!", "error");
      return;
    }

    if (!password2.trim()) {
      showSnackbar("Preencha os dois campos de senha!", "error");
      return;
    }

    if(password.length < 5){
      showSnackbar("Senha precisa de no mínimo 5 caracteres", "error");
      return;
    }

    if (password != password2) {
      showSnackbar("Senhas precisam ser iguais!", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, admin })
      });

      if (res.status === 201) {
        showSnackbar("Cadastro realizado com sucesso!", "success");
        setTimeout(() => {
          navigate("/");
        }, 1500)
      } else if (res.status === 409) {
        showSnackbar("Email já cadastrado!", "error"); 
      } else if (res.status === 400) {
        const errorData = await res.json();
        showSnackbar(errorData.message || "Dados inválidos!", "error");
      } else {
        showSnackbar("Erro inesperado!", "error");
      }
    } catch (err) {
      showSnackbar("Erro ao conectar com servidor!", "error");
    }
  };

  return (
    <>
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
            Registro
          </Typography>

          <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>

            <TextField id="registerNameField"
              fullWidth
              value={name}
              placeholder="Nome completo"
              required
              autoFocus
              sx={{ mb: 2 }}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField id="registerEmailField"
              placeholder="Email"
              fullWidth
              required
              type="email"
              value={email}
              sx={{ mb: 2 }}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField id="registerPasswordField"
              placeholder="Senha"
              fullWidth
              required
              type="password"
              value={password}
              sx={{ mb: 2 }}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField id="registerConfirmPasswordField"
              placeholder="Confirme a senha"
              fullWidth
              required
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />


            {admin && (
              <FormControlLabel
                control={<Checkbox checked disabled color="primary" />}
                label="Administrador"
              />
            )}

            <Button id="registerButton" type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
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
    </>
  );
}