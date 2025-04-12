import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { User } from '../../interfaces/User';
import { UserRole, Permission } from '../../interfaces/Role';
import { PermissionGuard } from '../PermissionGuard/PermissionGuard';

// Моковые данные пользователей для демонстрации
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'ivan.petrov',
    fullName: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    role: UserRole.SUPERVISOR,
    position: 'Старший смены',
    department: 'Склад А',
    phoneNumber: '+7 (999) 123-45-67',
    isActive: true,
    lastLogin: new Date('2024-03-20'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: '2',
    username: 'petr.sidorov',
    fullName: 'Петр Сидоров',
    email: 'petr.sidorov@example.com',
    role: UserRole.WORKER,
    position: 'Кладовщик',
    department: 'Склад Б',
    phoneNumber: '+7 (999) 765-43-21',
    isActive: true,
    lastLogin: new Date('2024-03-19'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-19'),
  },
];

// Интерфейс для формы пользователя
interface UserFormData {
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  position?: string;
  department?: string;
  phoneNumber?: string;
  password?: string;
}

const initialFormData: UserFormData = {
  username: '',
  fullName: '',
  email: '',
  role: UserRole.WORKER,
  position: '',
  department: '',
  phoneNumber: '',
  password: '',
};

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  // Мок текущего пользователя (админ)
  const currentUser: User = {
    id: 'admin',
    username: 'admin',
    fullName: 'Администратор',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        position: user.position,
        department: user.department,
        phoneNumber: user.phoneNumber,
      });
    } else {
      setEditingUser(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData(initialFormData);
  };

  const handleSubmit = () => {
    if (editingUser) {
      // Обновление существующего пользователя
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, updatedAt: new Date() }
          : user
      ));
    } else {
      // Создание нового пользователя
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUsers([...users, newUser]);
    }
    handleCloseDialog();
  };

  const handleToggleActive = (user: User) => {
    setUsers(users.map(u =>
      u.id === user.id
        ? { ...u, isActive: !u.isActive, updatedAt: new Date() }
        : u
    ));
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя ${user.fullName}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  return (
    <PermissionGuard
      user={currentUser}
      permissions={Permission.MANAGE_USERS}
      fallback={<Typography>У вас нет прав для управления пользователями</Typography>}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Управление пользователями</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Добавить пользователя
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Статус</TableCell>
                <TableCell>Имя пользователя</TableCell>
                <TableCell>ФИО</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Должность</TableCell>
                <TableCell>Отдел</TableCell>
                <TableCell>Последний вход</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Chip
                      icon={user.isActive ? <ActiveIcon /> : <BlockIcon />}
                      label={user.isActive ? 'Активен' : 'Заблокирован'}
                      color={user.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    {user.lastLogin?.toLocaleDateString() ?? 'Нет входа'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Редактировать">
                      <IconButton onClick={() => handleOpenDialog(user)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.isActive ? 'Заблокировать' : 'Активировать'}>
                      <IconButton onClick={() => handleToggleActive(user)} size="small">
                        {user.isActive ? <BlockIcon /> : <ActiveIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton onClick={() => handleDelete(user)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingUser ? 'Редактировать пользователя' : 'Создать пользователя'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Имя пользователя"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="ФИО"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
              {!editingUser && (
                <TextField
                  label="Пароль"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  fullWidth
                  required
                />
              )}
              <FormControl fullWidth>
                <InputLabel>Роль</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  label="Роль"
                >
                  {Object.values(UserRole).map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Должность"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                fullWidth
              />
              <TextField
                label="Отдел"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                fullWidth
              />
              <TextField
                label="Телефон"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingUser ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGuard>
  );
};

export default UserManager; 