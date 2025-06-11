import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PeopleIcon from '@mui/icons-material/People';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import TaskIcon from '@mui/icons-material/Task';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();
    return (
        <AppBar position="fixed" color="primary">
            <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                    <IconButton color="inherit" >
                        <AddTaskOutlinedIcon />
                    </IconButton>
                    <Typography variant="h6">Gerenciador de Tarefas</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <Tooltip title="Tarefas">
                        <IconButton color="inherit" onClick={() => {
                            navigate("/tasks");
                           }}>

                            <TaskIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Usuários">
                        <IconButton color="inherit" onClick={() => {
                            navigate("/user");
                        }}>
                            <PeopleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Log out">
                        <IconButton onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}>
                            <LogoutOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
