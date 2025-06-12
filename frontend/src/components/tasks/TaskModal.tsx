import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { TaskForm } from "./TaskForm";

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
  const isEditing = !!task;
  const title = isEditing ? "Editar Tarefa" : "Criar Tarefa";
  const submitLabel = isEditing ? "Atualizar" : "Criar";

  const handleSubmit = async (data: TaskFormData): Promise<boolean> => {
    const success = await onSubmit(data);
    if (success) {
      onClose();
    }
    return success;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TaskForm
          users={users}
          initialData={task}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel={submitLabel}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
        />
      </DialogContent>
    </Dialog>
  );
};