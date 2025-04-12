import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormHelperText,
} from '@mui/material';
import { Task, TaskStatus, TaskPriority } from '../../interfaces/Task';
import { db } from '../../config/supabase';

// Словарь для перевода статусов
const STATUS_LABELS = {
  [TaskStatus.NOT_STARTED]: 'Не начата',
  [TaskStatus.IN_PROGRESS]: 'В работе',
  [TaskStatus.COMPLETED]: 'Завершена',
  [TaskStatus.ON_HOLD]: 'На паузе'
};

// Словарь для перевода приоритетов
const PRIORITY_LABELS = {
  [TaskPriority.LOW]: 'Низкий',
  [TaskPriority.MEDIUM]: 'Средний',
  [TaskPriority.HIGH]: 'Высокий',
  [TaskPriority.URGENT]: 'Срочный'
};

interface NewTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const NewTaskDialog: React.FC<NewTaskDialogProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NOT_STARTED);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [users, setUsers] = useState<Array<{ id: string; fullName: string }>>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await db.getUsers();
        setUsers(users.map(user => ({
          id: user.id,
          fullName: user.fullName
        })));
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    if (open) {
      loadUsers();
    }
  }, [open]);

  const validateLocation = (value: string) => {
    if (!value) {
      setLocationError('');
      return true;
    }
    const locationRegex = /^\d{2},\d{2},\d{2},\d{2}$/;
    if (!locationRegex.test(value)) {
      setLocationError('Формат: XX,XX,XX,XX (где X - цифра)');
      return false;
    }
    setLocationError('');
    return true;
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    validateLocation(value);
  };

  const handleSubmit = () => {
    // Only validate location if it's not empty
    if (location && !validateLocation(location)) {
      return;
    }

    const newTask: Omit<Task, 'id' | 'createdAt'> = {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate: new Date(dueDate),
      location: location || '',
      items: [],
      orderNumber: '',
    };
    onSubmit(newTask);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.NOT_STARTED);
    setPriority(TaskPriority.MEDIUM);
    setAssignedTo('');
    setDueDate('');
    setLocation('');
    setLocationError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать новую задачу</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            error={!title}
            helperText={!title ? 'Обязательное поле' : ''}
          />
          
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={status}
              label="Статус"
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {Object.entries(TaskStatus).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {STATUS_LABELS[value]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Приоритет</InputLabel>
            <Select
              value={priority}
              label="Приоритет"
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              {Object.entries(TaskPriority).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {PRIORITY_LABELS[value]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required error={!assignedTo}>
            <InputLabel>Исполнитель</InputLabel>
            <Select
              value={assignedTo}
              label="Исполнитель"
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName}
                </MenuItem>
              ))}
            </Select>
            {!assignedTo && (
              <FormHelperText>Обязательное поле</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Срок выполнения"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            required
            error={!dueDate}
            helperText={!dueDate ? 'Обязательное поле' : ''}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Местоположение"
            value={location}
            onChange={handleLocationChange}
            fullWidth
            error={!!locationError}
            helperText={locationError || 'Формат: XX,XX,XX,XX (необязательно)'}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!title || !dueDate || !assignedTo || !!locationError}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTaskDialog; 