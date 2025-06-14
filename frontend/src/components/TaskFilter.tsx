import { useState } from "react";
import {
  Box, Button, Typography, Select, MenuItem,
  FormControl, InputLabel, Card, CardContent
} from "@mui/material";
import { FilterList as FilterIcon, Clear as ClearIcon } from "@mui/icons-material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface User {
  id: number;
  name: string;
  email: string;
}

interface TaskFilterProps {
  users: User[];
  isAdmin: boolean;
  onFilter: (filters: {
    status?: string;
    endDate?: string;
    userId?: string;
  }) => void;
  onClearFilters: () => void;
}

export const TaskFilter = ({ users, isAdmin, onFilter, onClearFilters }: TaskFilterProps) => {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [filterAssigneeId, setFilterAssigneeId] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const handleFilter = () => {
    let adjustedEndDate = filterEndDate;
    if (filterEndDate) {
      const date = dayjs(filterEndDate).add(1, 'day');
      adjustedEndDate = date.format('YYYY-MM-DD');
    }

    const filters = {
      status: filterStatus || undefined,
      endDate: adjustedEndDate || undefined,
      userId: filterAssigneeId || undefined,
    };
    onFilter(filters);
  };

  const handleClearFilters = () => {
    setFilterStatus("");
    setFilterEndDate("");
    setFilterAssigneeId("");
    onClearFilters();
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Ocultar Filtros" : "Filtros"}
      </Button>

      {showFilters && (
        <Card
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            mt: 1,
            minWidth: 400,
            zIndex: 1000,
            boxShadow: 3
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filtros
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'end' }}>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Completo">Completo</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>

              <DatePicker
                label="Data de Entrega"
                value={filterEndDate ? dayjs(filterEndDate) : null}
                onChange={(newValue) => {
                  setFilterEndDate(newValue ? newValue.format('YYYY-MM-DD') : '');
                }}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: 150 },
                  },
                }}
              />

              {isAdmin && (
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel>Responsável</InputLabel>
                  <Select
                    value={filterAssigneeId}
                    onChange={(e) => setFilterAssigneeId(e.target.value)}
                    label="Responsável"
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleFilter}
                  size="small"
                >
                  Filtrar
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                  size="small"
                >
                  Limpar
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};