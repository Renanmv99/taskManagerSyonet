import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [editError, setEditError] = useState("");

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success"
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const decoded = parseJwt(token);
    if (decoded?.groups?.includes("admin")) {
      setIsAdmin(true);
    }

    fetchUsers(token);
  }, [navigate]);

  const refreshToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      navigate("/");
      return null;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        
        const decoded = parseJwt(data.token);
        if (decoded?.groups?.includes("admin")) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        return data.token;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/");
        return null;
      }
    } catch (error) {
      console.error("Erro ao fazer refresh do token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      navigate("/");
      return null;
    }
  };

  const fetchUsers = (token: string) => {
    fetch("http://localhost:8080/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          showSnackbar("Erro ao buscar usuários.", "error");
        }
      })
      .catch(() => showSnackbar("Erro de conexão com o backend.", "error"));
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Tem certeza que deseja deletar este usuário?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("Você precisa estar logado.", "error");
      return;
    }

    if (users.length <= 1) {
      showSnackbar("Você não pode deletar o único usuário.", "error");
      return;
    }

    fetch(`http://localhost:8080/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== id));
          showSnackbar("Usuário deletado com sucesso!", "success");
        } else {
          const errorMessage = await res.text();    
          if (res.status === 409 ) {
            showSnackbar(errorMessage || "Erro ao deletar usuário.", "error");
          }
        }
      })
      .catch(() => showSnackbar("Erro de conexão com o backend.", "error"));
  };

  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword("")
    setAdmin(user.admin);
    setIsModalOpen(true);
    setEditError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setName("");
    setEmail("");
    setPassword("")
    setAdmin(false);
    setEditError("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/user/${editingUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          admin,
        }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUserId ? { ...u, name, email, admin } : u
          )
        );
        closeModal();
        showSnackbar("Usuário atualizado com sucesso!", "success");
        
        const decoded = parseJwt(token);
        if (decoded?.id === editingUserId) {
          await refreshToken();
          showSnackbar("Informações atualizadas com sucesso!", "success");
        }
      } else {
        const data = await res.text();
        setEditError(`Erro ao editar usuário: ${data}`);
      }
    } catch {
      setEditError("Erro ao conectar com o backend.");
    }
  };

  return {
    users,
    isAdmin,
    isModalOpen,
    editingUserId,

    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    admin,
    setAdmin,
    editError,

    snackbar,
    closeSnackbar,

    handleDelete,
    openEditModal,
    closeModal,
    handleEditSubmit,
    showSnackbar,
    refreshToken,
  };
};