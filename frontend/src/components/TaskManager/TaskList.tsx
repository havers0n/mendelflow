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
  DialogContentText,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Task, TaskStatus, TaskPriority, TaskComment } from '../../interfaces/Task';
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
  const [newComment, setNewComment] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

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

  // Фильтрация задач
  const getFilteredTasks = () => {
    let filtered = tasks;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(s) ||
        (t.description && t.description.toLowerCase().includes(s)) ||
        (t.assignedTo && t.assignedTo.toLowerCase().includes(s))
      );
    }
    return filtered;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
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
      {/* Поиск и фильтры */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={e => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="NOT_STARTED">Не начата</MenuItem>
            <MenuItem value="IN_PROGRESS">В работе</MenuItem>
            <MenuItem value="COMPLETED">Завершена</MenuItem>
            <MenuItem value="ON_HOLD">На паузе</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Приоритет</InputLabel>
          <Select
            value={priorityFilter}
            label="Приоритет"
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="LOW">Низкий</MenuItem>
            <MenuItem value="MEDIUM">Средний</MenuItem>
            <MenuItem value="HIGH">Высокий</MenuItem>
            <MenuItem value="URGENT">Срочный</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1 }}>
          <input
            type="text"
            placeholder="Поиск по названию, описанию, исполнителю..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </Box>
      </Box>
      <Paper>
        <List>
          {getFilteredTasks().map((task) => (
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
            {/* Комментарии */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Комментарии</Typography>
              <List sx={{ maxHeight: 120, overflow: 'auto', mb: 1 }}>
                {editedTask?.comments && editedTask.comments.length > 0 ? (
                  editedTask.comments.map((comment, idx) => (
                    <ListItem key={idx} alignItems="flex-start">
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {comment.author} — {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">{comment.text}</Typography>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">Комментариев нет</Typography>
                )}
              </List>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label="Добавить комментарий"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (!newComment.trim()) return;
                    setEditedTask(prev => ({
                      ...prev,
                      comments: [
                        ...(prev.comments || []),
                        {
                          author: currentUser.fullName || currentUser.username,
                          text: newComment,
                          createdAt: new Date(),
                        },
                      ],
                    }));
                    setNewComment('');
                  }}
                >
                  Добавить
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveTask} variant="contained">
            Сохранить
          </Button>
          <Button
            color="success"
            variant="outlined"
            onClick={async () => {
              if (!selectedTask) return;
              await onTaskUpdate(selectedTask.id, {
                ...editedTask,
                status: TaskStatus.COMPLETED,
                comments: editedTask.comments,
              });
              setIsEditDialogOpen(false);
              setEditedTask({});
            }}
            disabled={editedTask.status === TaskStatus.COMPLETED}
          >
            Выполнить
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