import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { UserForm } from "./UserForm";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword:(password: string) => void;
  oldPassword: string;
  setOldPassword:(password: string) => void;
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
  oldPassword,
  setOldPassword,
  admin,
  setAdmin,
  error,
}: UserModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Usuário</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <UserForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            admin={admin}
            setAdmin={setAdmin}
            error={error}
          />
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