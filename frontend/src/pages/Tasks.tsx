import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { TaskFilter } from "../components/TaskFilter";
import { TaskSearch } from "../components/TaskSearch";
import { TaskList } from "../components/tasks/TaskList";
import { TaskModal } from "../components/tasks/TaskModal";
import { useTasks } from "../hooks/useTask";

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

interface Filters {
  status?: string;
  endDate?: string;
  userId?: string;
  title?: string;
}

interface TaskFormData {
  title: string;
  description: string;
  endDate: string;
  userId: number;
  status: "Pendente" | "Completo" | "Cancelado";
}

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export default function Tasks() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const navigate = useNavigate();
  
  const {
    tasks,
    users,
    loading,
    error,
    successMessage,
    fetchTasks,
    fetchUsers,
    createTask,
    updateTask,
    deleteTask,
    clearMessages,
    snackbar,
    closeSnackbar
  } = useTasks();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const decoded = parseJwt(token);
    const adminStatus = decoded?.groups?.includes("admin") || false;
    setIsAdmin(adminStatus);
    
    if (decoded?.id) {
      setCurrentUserId(decoded.id);
    }

    fetchTasks(token);
    
    if (adminStatus) {
      fetchUsers(token);
    }
  }, [navigate, fetchTasks, fetchUsers]);

  const handleFilter = useCallback((filters: {
    status?: string;
    endDate?: string;
    userId?: string;
  }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const newFilters = {
      ...filters,
      title: currentFilters.title
    };

    setCurrentFilters(newFilters);
    fetchTasks(token, newFilters);
  }, [currentFilters.title, fetchTasks, navigate]);

  const handleSearch = useCallback((searchTerm: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const newFilters = {
      ...currentFilters,
      title: searchTerm || undefined
    };

    setCurrentFilters(newFilters);
    fetchTasks(token, newFilters);
  }, [currentFilters, fetchTasks, navigate]);

  const handleClearSearch = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const newFilters = {
      ...currentFilters,
      title: undefined
    };
    
    setCurrentFilters(newFilters);
    fetchTasks(token, newFilters);
  }, [currentFilters, fetchTasks, navigate]);

  const handleClearFilters = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    setCurrentFilters({});
    fetchTasks(token);
  }, [fetchTasks, navigate]);

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = async (data: TaskFormData): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return false;
    }

    let success: boolean;

    if (editingTask) {
      success = await updateTask(editingTask.id, data);
    } else {
      success = await createTask(data);
      if (success) {
        await fetchTasks(token, currentFilters, true);
      }
    }

    return success;
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
  };

  return (
    <Box>
      <Header/>
      <Box sx={{ marginTop: 7, padding: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 2 }}>
          <Box>
            {
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreateModal}
              >
                Criar Nova Tarefa
              </Button>
            }
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TaskSearch
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
              placeholder="Buscar tarefa"
            />
            <TaskFilter
              users={users}
              isAdmin={isAdmin}
              onFilter={handleFilter}
              onClearFilters={handleClearFilters}
            />
          </Box>
        </Box>

        <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 2 }}>
          {error && (
            <Alert severity="error" onClose={clearMessages}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" onClose={clearMessages}>
              {successMessage}
            </Alert>
          )}
        </Box>

        <TaskList
          tasks={tasks}
          onEdit={openEditModal}
          onDelete={handleDelete}
          loading={loading}
        />
      </Box>

      <TaskModal
        open={isModalOpen}
        onClose={closeModal}
        users={users}
        task={editingTask}
        onSubmit={handleTaskSubmit}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
      />
      
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
    </Box>
  );
}