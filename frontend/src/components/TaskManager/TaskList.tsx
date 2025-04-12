import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  DialogContentText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Task, TaskStatus, TaskPriority } from '../../interfaces/Task';
import { User } from '../../interfaces/User';
import NewTaskDialog from './NewTaskDialog';

interface TaskListProps {
  tasks: Task[];
  currentUser: User;
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  currentUser,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditedTask(task);
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveTask = async () => {
    if (!editedTask.title || !editedTask.status || !editedTask.priority || !editedTask.assignedTo) {
      return;
    }

    if (selectedTask) {
      await onTaskUpdate(selectedTask.id, editedTask);
    }
    setIsEditDialogOpen(false);
    setEditedTask({});
  };

  const handleCreateTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    await onTaskCreate(task);
    setIsNewTaskDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTask) {
      await onTaskDelete(selectedTask.id);
      setIsDeleteDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NOT_STARTED:
        return 'default';
      case TaskStatus.IN_PROGRESS:
        return 'primary';
      case TaskStatus.COMPLETED:
        return 'success';
      case TaskStatus.ON_HOLD:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.ON_HOLD:
        return <WarningIcon color="warning" />;
      case TaskStatus.COMPLETED:
        return <CheckCircleIcon color="success" />;
      default:
        return <AssignmentIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Управление задачами
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewTaskDialogOpen(true)}
        >
          Новая задача
        </Button>
      </Box>

      <Paper>
        <List>
          {tasks.map((task) => (
            <ListItem
              component="div"
              key={task.id}
              onClick={() => handleTaskClick(task)}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
                cursor: 'pointer'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(task.status)}
                  <Typography component="span" variant="body1">
                    {task.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={task.status}
                    size="small"
                    color={getStatusColor(task.status)}
                  />
                  <Chip
                    label={task.priority}
                    size="small"
                    color={task.priority === TaskPriority.URGENT ? 'error' : 'default'}
                  />
                  <Typography component="span" variant="body2" color="text.secondary">
                    Исполнитель: {task.assignedTo}
                  </Typography>
                </Box>
              </Box>
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskClick(task);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(task);
                    setIsDeleteDialogOpen(true);
                  }}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Диалог создания новой задачи */}
      <NewTaskDialog
        open={isNewTaskDialogOpen}
        onClose={() => setIsNewTaskDialogOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Диалог редактирования задачи */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Редактирование задачи
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Название"
              value={editedTask?.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={true}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Описание"
              value={editedTask?.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                select
                label="Статус"
                value={editedTask?.status || TaskStatus.NOT_STARTED}
                onChange={(e) => handleInputChange('status', e.target.value)}
                required
              >
                {Object.values(TaskStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Приоритет"
                value={editedTask?.priority || TaskPriority.MEDIUM}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                required
              >
                {Object.values(TaskPriority).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              fullWidth
              label="Исполнитель"
              value={editedTask?.assignedTo || ''}
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Местоположение"
              value={editedTask?.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              helperText="Формат: XX,XX,XX,XX (необязательно)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveTask} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить эту задачу?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList; 