import { useState } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Drawer";
import { UserList } from "../components/users/UserList";
import { UserModal } from "../components/users/UserModal";
import { useUser } from "../hooks/useUser";

const drawerWidth = 240;

export default function Users() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const {
    users,
    isAdmin,

    isModalOpen,

    name,
    setName,
    email,
    setEmail,
    admin,
    setAdmin,
    editError,

    snackbar,
    closeSnackbar,

    handleDelete,
    openEditModal,
    closeModal,
    handleEditSubmit,
  } = useUser();

  return (
    <Box>
      <Header onMenuClick={() => setDrawerOpen(!drawerOpen)} />
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Box sx={{ marginLeft: `${drawerOpen ? drawerWidth : 0}px`, marginTop: 7, padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lista de Usuários
        </Typography>

        <UserList
          users={users}
          isAdmin={isAdmin}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </Box>

      <UserModal
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={handleEditSubmit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        admin={admin}
        setAdmin={setAdmin}
        error={editError}
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