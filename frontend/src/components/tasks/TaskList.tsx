import React from "react";
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

interface Task {
  id: number;
  title: string;
  description: string;
  status: "Pendente" | "Completo" | "Cancelado";
  endDate: string;
  done: boolean;
  assignee: {
    id: number;
    name: string;
  };
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  loading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completo":
        return "success";
      case "Cancelado":
        return "error";
      default:
        return "warning";
    }
  };

  if (loading) {
    return <Typography>Carregando tarefas...</Typography>;
  }

  if (tasks.length === 0) {
    return <Typography>Nenhuma tarefa encontrada.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>Id</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Prazo</TableCell>
            <TableCell>Responsável</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} hover>
              <TableCell>{task.id}</TableCell>
              <Tooltip title={task.title}>
              <TableCell sx={{                        
                        maxWidth: "7vw",
                        maxHeight: "4vw",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",}}
                        >{task.title}</TableCell>
                        </Tooltip>
              <Tooltip title={task.description}>
              <TableCell sx={{
                        maxWidth: "24vw",
                        maxHeight: "4vw",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"}}
                        >{task.description}</TableCell>
                        </Tooltip>
              <TableCell>
                {new Date(task.endDate).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>{task.assignee?.name || "Não atribuído"}</TableCell>
              <TableCell align="center">
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Editar tarefa">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(task)}
                  title="Editar tarefa"
                >
                  <EditIcon />
                </IconButton>
                </Tooltip>
                <Tooltip title="Excluir tarefa">
                <IconButton
                  color="error"
                  onClick={() => onDelete(task.id)}
                  title="Deletar tarefa"
                >
                  <DeleteIcon />
                </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};