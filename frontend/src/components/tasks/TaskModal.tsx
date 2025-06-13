import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: "Pendente" | "Completo" | "Cancelado";
  endDate: string;
  assignee: {
    id: number;
    name: string;
  };
}

interface TaskFormData {
  title: string;
  description: string;
  endDate: string;
  userId: number;
  status: "Pendente" | "Completo" | "Cancelado";
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<boolean>;
  isAdmin: boolean;
  currentUserId: number;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  users,
  task,
  onSubmit,
  isAdmin,
  currentUserId
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<number | "">("");
  const [status, setStatus] = useState<"Pendente" | "Completo" | "Cancelado">("Pendente");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!task;
  const modalTitle = isEditing ? "Editar Tarefa" : "Criar Tarefa";
  const submitLabel = isEditing ? "Atualizar" : "Criar";

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setEndDate(task.endDate);
      setAssigneeId(task.assignee?.id || "");
      setStatus(task.status);
    } else {
      setTitle("");
      setDescription("");
      setEndDate("");
      setAssigneeId(isAdmin ? "" : currentUserId);
      setStatus("Pendente");
    }
    setError("");
  }, [task, isAdmin, currentUserId]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError("Título é obrigatório.");
      return false;
    }
    if (!description.trim()) {
      setError("Descrição é obrigatória.");
      return false;
    }
    if (!endDate) {
      setError("Data de entrega é obrigatória.");
      return false;
    }
    if (!assigneeId) {
      setError("Responsável é obrigatório.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData: TaskFormData = {
      title: title.trim(),
      description: description.trim(),
      endDate,
      userId: Number(assigneeId),
      status,
    };

    const success = await onSubmit(formData);

    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Título"
              required
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />

            <TextField
              label="Descrição"
              required
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />

            <DatePicker
              label="Data de Entrega"
              value={endDate ? dayjs(endDate) : null}
              onChange={(newValue) => {
                setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '');
              }}
              disablePast
              format="DD-MM-YYYY"
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  disabled: isSubmitting,
                },
              }}
            />

            {isAdmin && (
              <FormControl fullWidth required>
                <InputLabel>Responsável</InputLabel>
                <Select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value as number)}
                  label="Responsável"
                  disabled={isSubmitting}
                >
                  <MenuItem value="">
                    <em>Selecione um usuário</em>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Pendente" | "Completo" | "Cancelado")}
                label="Status"
                disabled={isSubmitting}
              >
                <MenuItem value="Pendente">Pendente</MenuItem>
                <MenuItem value="Completo">Completo</MenuItem>
                <MenuItem value="Cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !assigneeId}
              >
                {isSubmitting ? "Salvando..." : submitLabel}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};