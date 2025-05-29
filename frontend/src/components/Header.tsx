import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    const navigate = useNavigate();
    return (
        <AppBar position="fixed" color="primary">
            <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" onClick={onMenuClick}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Gerenciador de Tarefas</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <Avatar />
                    <IconButton onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}>
                        <LogoutOutlinedIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
