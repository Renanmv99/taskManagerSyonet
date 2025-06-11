import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";

interface UserFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  oldPassword: string;
  setOldPassword: (password: string) => void;
  admin: boolean;
  setAdmin: (admin: boolean) => void;
  error?: string;
}

export const UserForm = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  oldPassword,
  setOldPassword,
  admin,
  setAdmin,
  error,
}: UserFormProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
      <TextField
        label="Nome"
        required
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label="Email"
        required
        fullWidth
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        placeholder="Insira a nova senha"
        fullWidth
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        placeholder="Insira a senha atual"
        fullWidth
        required
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
            color="primary"
          />
        }
        label="Administrador"
      />

      {error && (
        <Alert severity="error">{error}</Alert>
      )}
    </Box>
  );
};