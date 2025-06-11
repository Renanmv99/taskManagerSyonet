import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
}

interface UserListProps {
  users: User[];
  isAdmin: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const UserList = ({ users, isAdmin, onEdit, onDelete }: UserListProps) => {
  if (users.length === 0) {
    return <Typography>Nenhum usuário encontrado.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="center">Admin</TableCell>
            {isAdmin && <TableCell align="center">Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell align="center">
                <Chip
                  label={user.admin ? "Sim" : "Não"}
                  color={user.admin ? "success" : "default"}
                />
              </TableCell>
              {isAdmin && (
                <TableCell align="center">
                  <Tooltip title="Editar usuário">
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir usuário">
                  <IconButton
                    color="error"
                    onClick={() => onDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};