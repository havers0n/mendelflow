import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  ShoppingCart as OrderIcon,
  CheckCircle as CompletedIcon,
  Warning as ProblemIcon,
  AccessTime as ProcessingIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  NewReleases as NewIcon,
  Refresh as InProgressIcon,
} from '@mui/icons-material';
import { Task, TaskStatus, TaskPriority } from '../../interfaces/Task';
import { Order, OrderStatus } from '../../interfaces/Order';
import NewTaskDialog from '../TaskManager/NewTaskDialog';
import NewOrderDialog from '../OrderManager/NewOrderDialog';
import { Permission, UserRole } from '../../interfaces/Role';
import { PermissionGuard } from '../PermissionGuard/PermissionGuard';
import { User } from '../../interfaces/User';

// Моковые данные для демонстрации
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Сборка заказа #123',
    description: 'Собрать и упаковать заказ',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    assignedTo: 'Иван Иванов',
    createdAt: new Date('2024-03-19'),
    dueDate: new Date('2024-03-20'),
    location: '01,01,00,00',
    items: []
  },
  {
    id: '2',
    title: 'Проверка товара',
    description: 'Проверить качество поступившего товара',
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.MEDIUM,
    assignedTo: 'Петр Сидоров',
    createdAt: new Date('2024-03-20'),
    dueDate: new Date('2024-03-21'),
    location: '02,01,00,00',
    items: []
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-123',
    status: OrderStatus.IN_PROGRESS,
    createdAt: new Date('2024-03-19'),
    updatedAt: new Date('2024-03-19'),
    items: [],
    tasks: [],
    invoiceNumber: 'INV-12345',
    customerName: 'Иванов И.И.',
    customerContact: '+7 (999) 123-45-67',
    notes: 'Срочный заказ',
    progress: 50
  },
  {
    id: '2',
    orderNumber: 'ORD-124',
    status: OrderStatus.NEW,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    items: [],
    tasks: [],
    invoiceNumber: 'INV-12346',
    customerName: 'Петров П.П.',
    customerContact: '+7 (999) 765-43-21',
    notes: '',
    progress: 0
  }
];

// Временный мок пользователя для демонстрации
const mockUser: User = {
  id: '1',
  username: 'ivan.petrov',
  fullName: 'Иван Петров',
  email: 'ivan.petrov@example.com',
  role: UserRole.SUPERVISOR,
  position: 'Старший смены',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Словарь для перевода статусов задач
const TASK_STATUS_LABELS = {
  [TaskStatus.NOT_STARTED]: 'Не начата',
  [TaskStatus.IN_PROGRESS]: 'В работе',
  [TaskStatus.COMPLETED]: 'Завершена',
  [TaskStatus.ON_HOLD]: 'На паузе'
};

// Словарь для перевода приоритетов
const TASK_PRIORITY_LABELS = {
  [TaskPriority.LOW]: 'Низкий',
  [TaskPriority.MEDIUM]: 'Средний',
  [TaskPriority.HIGH]: 'Высокий',
  [TaskPriority.URGENT]: 'Срочный'
};

// Словарь для перевода статусов заказов
const ORDER_STATUS_LABELS = {
  [OrderStatus.NEW]: 'Новый',
  [OrderStatus.IN_PROGRESS]: 'В работе',
  [OrderStatus.COMPLETED]: 'Завершён',
  [OrderStatus.ON_HOLD]: 'На паузе'
};

const getStatusColor = (status: TaskStatus | OrderStatus) => {
  switch (status) {
    case TaskStatus.NOT_STARTED:
    case OrderStatus.NEW:
      return 'default';
    case TaskStatus.IN_PROGRESS:
    case OrderStatus.IN_PROGRESS:
      return 'info';
    case TaskStatus.ON_HOLD:
    case OrderStatus.ON_HOLD:
      return 'warning';
    case TaskStatus.COMPLETED:
    case OrderStatus.COMPLETED:
      return 'success';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: TaskStatus | OrderStatus) => {
  switch (status) {
    case TaskStatus.NOT_STARTED:
    case OrderStatus.NEW:
      return <NewIcon />;
    case TaskStatus.IN_PROGRESS:
    case OrderStatus.IN_PROGRESS:
      return <InProgressIcon color="info" />;
    case TaskStatus.ON_HOLD:
    case OrderStatus.ON_HOLD:
      return <WarningIcon color="warning" />;
    case TaskStatus.COMPLETED:
    case OrderStatus.COMPLETED:
      return <CheckCircleIcon color="success" />;
    default:
      return null;
  }
};

const Dashboard: React.FC = () => {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleNewTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    // В реальном приложении здесь будет API-запрос
    console.log('New task:', task);
    setIsNewTaskDialogOpen(false);
  };

  const handleNewOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => {
    // В реальном приложении здесь будет API-запрос
    console.log('New order:', order);
    setIsNewOrderDialogOpen(false);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
    setNotificationType('');
    setNotificationMessage('');
  };

  const handleNotificationSubmit = () => {
    // Here you would typically send the notification to the server
    console.log('Notification sent:', { type: notificationType, message: notificationMessage });
    handleNotificationClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h4">
          Дашборд
        </Typography>
        <PermissionGuard
          user={mockUser}
          permissions={Permission.SEND_NOTIFICATIONS}
          fallback={null}
        >
          <Fab
            color="secondary"
            aria-label="notify"
            onClick={() => setNotificationOpen(true)}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: '#f50057',
              '&:hover': {
                backgroundColor: '#c51162',
                transform: 'scale(1.1)',
              },
              '& .MuiSvgIcon-root': {
                fontSize: 32,
              },
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            <NotificationsIcon />
          </Fab>
        </PermissionGuard>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Активные задачи */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card>
            <CardHeader
              title="Активные задачи"
              action={
                <PermissionGuard
                  user={mockUser}
                  permissions={Permission.CREATE_TASK}
                  fallback={null}
                >
                  <Tooltip title="Создать новую задачу">
                    <IconButton onClick={() => setIsNewTaskDialogOpen(true)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </PermissionGuard>
              }
            />
            <CardContent>
              <List>
                {MOCK_TASKS.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography component="div" variant="subtitle1">
                        {task.title}
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            size="small"
                            label={TASK_STATUS_LABELS[task.status]}
                            color={getStatusColor(task.status)}
                          />
                          <Chip
                            size="small"
                            label={TASK_PRIORITY_LABELS[task.priority]}
                            color={task.priority === TaskPriority.URGENT ? 'error' : 'default'}
                          />
                        </Box>
                        <Typography component="div" variant="body2" color="text.secondary">
                          Исполнитель: {task.assignedTo}
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary">
                          Локация: {task.location}
                        </Typography>
                      </Stack>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Активные заказы */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card>
            <CardHeader
              title="Активные заказы"
              action={
                <PermissionGuard
                  user={mockUser}
                  permissions={Permission.CREATE_ORDER}
                  fallback={null}
                >
                  <Tooltip title="Создать новый заказ">
                    <IconButton onClick={() => setIsNewOrderDialogOpen(true)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </PermissionGuard>
              }
            />
            <CardContent>
              <List>
                {MOCK_ORDERS.map((order) => (
                  <ListItem
                    key={order.id}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <ListItemIcon>
                      <OrderIcon />
                    </ListItemIcon>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography component="div" variant="subtitle1">
                        Заказ #{order.orderNumber}
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            size="small"
                            label={ORDER_STATUS_LABELS[order.status]}
                            color={getStatusColor(order.status)}
                          />
                          <Chip
                            size="small"
                            label={`${order.progress}%`}
                            color={order.progress === 100 ? 'success' : 'primary'}
                          />
                        </Box>
                        <Typography component="div" variant="body2" color="text.secondary">
                          Клиент: {order.customerName}
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary">
                          Накладная: {order.invoiceNumber}
                        </Typography>
                      </Stack>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Диалоги создания */}
      <NewTaskDialog
        open={isNewTaskDialogOpen}
        onClose={() => setIsNewTaskDialogOpen(false)}
        onSubmit={handleNewTask}
      />
      
      <NewOrderDialog
        open={isNewOrderDialogOpen}
        onClose={() => setIsNewOrderDialogOpen(false)}
        onSubmit={handleNewOrder}
      />

      {/* Notification Dialog */}
      <PermissionGuard
        user={mockUser}
        permissions={Permission.SEND_NOTIFICATIONS}
        fallback={null}
      >
        <Dialog open={notificationOpen} onClose={handleNotificationClose}>
          <DialogTitle>Отправить уведомление</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Тип уведомления</InputLabel>
              <Select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                label="Тип уведомления"
              >
                <MenuItem value="manager">Начальнику</MenuItem>
                <MenuItem value="foreman">Бригадиру</MenuItem>
                <MenuItem value="urgent">Срочное</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="Сообщение"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNotificationClose}>Отмена</Button>
            <Button onClick={handleNotificationSubmit} variant="contained" color="primary">
              Отправить
            </Button>
          </DialogActions>
        </Dialog>
      </PermissionGuard>
    </Box>
  );
};

export default Dashboard; 