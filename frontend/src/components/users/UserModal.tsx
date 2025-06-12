import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  admin: boolean;
  setAdmin: (admin: boolean) => void;
  error?: string;
}

export const UserModal = ({
  open,
  onClose,
  onSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  admin,
  setAdmin,
  error,
}: UserModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Usuário</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Nome"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              placeholder="Insira a nova senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Atualizar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};