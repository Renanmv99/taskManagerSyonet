import { useState, useEffect } from "react";
import {
  Box, TextField, InputAdornment, IconButton
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

interface TaskSearchProps {
  onSearch: (searchTerm: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
}

export const TaskSearch = ({ 
  onSearch, 
  onClearSearch, 
  placeholder = "Buscar por título..." 
}: TaskSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        onSearch(searchTerm.trim());
      } else if (searchTerm === "") {
        onClearSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch, onClearSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onClearSearch();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchTerm.trim()) {
        onSearch(searchTerm.trim());
      } else {
        onClearSearch();
      }
    }
  };

  return (
    <Box sx={{ mb: 2, maxWidth: 400 }}>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
                aria-label="limpar busca"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
          }
        }}
      />
    </Box>
  );
};