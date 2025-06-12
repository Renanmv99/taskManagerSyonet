import {
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { Header } from "../components/Header";
import { UserList } from "../components/users/UserList";
import { UserModal } from "../components/users/UserModal";
import { useUser } from "../hooks/useUser";

export default function Users() {
  
  const {
    users,
    isAdmin,

    isModalOpen,

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
  } = useUser();

  return (
    <Box>
      <Header/>
      <Box sx={{ marginTop: 7, padding: 4 }}>
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
        password={password}
        setPassword={setPassword}
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