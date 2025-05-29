import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
}

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = parseJwt(token);
            if (decoded?.groups?.includes("admin")) {
                setIsAdmin(true);
            }
        }
    }, []);

    const menuItems = [
        ...(isAdmin ? [{ text: "Usuários", icon: <PersonIcon />, path: "/user" }] : []),
        { text: "Tarefas", icon: <AttachMoneyIcon />, path: "/tasks" }
    ];

    return (
        <Drawer
            open={open}
            onClose={onClose}
            variant="persistent"
            sx={{
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    bgcolor: theme.palette.primary.main,
                    mt: "48px",
                },
            }}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            sx={{ color: theme.palette.primary.contrastText }}
                            onClick={() => {
                                navigate(item.path);
                                onClose();
                            }}
                        >
                            <ListItemIcon sx={{ color: theme.palette.primary.contrastText }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};
