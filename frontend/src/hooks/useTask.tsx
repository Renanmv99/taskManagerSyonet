import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

interface User {
  id: number;
  name: string;
  email: string;
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

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate();
  const fetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<string>("");

  const fetchTasks = useCallback(async (token: string, filters?: Filters, forceRefresh = false) => {
    const paramsString = JSON.stringify(filters || {});
    
    if (!forceRefresh && (fetchingRef.current || paramsString === lastFetchParamsRef.current)) {
      return;
    }

    fetchingRef.current = true;
    lastFetchParamsRef.current = paramsString;
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filters?.status) params.append('status', filters.status);
      if (filters?.endDate) params.append('endDateStr', filters.endDate);
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.title) params.append('title', filters.title);

      const url = `http://localhost:8080/task${params.toString() ? `?${params.toString()}` : ''}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        setError("");
      } else {
        setError("Erro ao buscar tarefas.");
      }
    } catch (err) {
      setError("Erro de conexão com o backend.");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const fetchUsers = useCallback(async (token: string) => {
    try {
      const res = await fetch("http://localhost:8080/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.log("Erro ao buscar usuários");
    }
  }, []);

  const createTask = useCallback(async (taskData: TaskFormData): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return false;
    }

    try {
      const res = await fetch("http://localhost:8080/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskData.title.trim(),
          description: taskData.description.trim(),
          endDate: taskData.endDate,
          userId: taskData.userId,
          status: taskData.status,
        }),
      });

      if (res.status === 201) {
        fetchingRef.current = false;
        lastFetchParamsRef.current = "";
        
        setSuccessMessage("Tarefa criada com sucesso!");
        return true;
      } else {
        const data = await res.text();
        setError(`Erro ao criar tarefa: ${data}`);
        return false;
      }
    } catch (err) {
      setError("Erro ao conectar com o backend.");
      return false;
    }
  }, [navigate]);

  const updateTask = useCallback(async (taskId: number, taskData: TaskFormData): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return false;
    }

    try {
      const res = await fetch(`http://localhost:8080/task/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskData.title.trim(),
          description: taskData.description.trim(),
          endDate: taskData.endDate,
          userId: taskData.userId,
          status: taskData.status,
        }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prev) =>
          prev.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        setSuccessMessage("Tarefa atualizada com sucesso!");
        return true;
      } else {
        const data = await res.text();
        setError(`Erro ao editar tarefa: ${data}`);
        return false;
      }
    } catch (err) {
      setError("Erro ao conectar com o backend.");
      return false;
    }
  }, [navigate]);

  const deleteTask = useCallback(async (id: number): Promise<boolean> => {
    const confirmed = window.confirm("Deseja realmente deletar esta tarefa?");
    if (!confirmed) return false;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado.");
      return false;
    }

    try {
      const res = await fetch(`http://localhost:8080/task/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setSuccessMessage("Tarefa deletada com sucesso!");
        return true;
      } else {
        setError("Erro ao deletar a tarefa.");
        return false;
      }
    } catch (err) {
      setError("Erro de conexão com o backend.");
      return false;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  return {
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
  };
};