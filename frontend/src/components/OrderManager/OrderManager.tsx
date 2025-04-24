import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Stack,
  Tabs,
  Tab,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  LocalShipping as ShippingIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Order, OrderStatus, OrderItemStatus } from '../../interfaces/Order';
import NewOrderDialog from './NewOrderDialog';
import OrderExecutionDialog from './OrderExecutionDialog';
import Dialog from '@mui/material/Dialog';

// Временные данные для демонстрации
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    status: OrderStatus.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      {
        id: '1',
        sku: 'WF-50-PVC',
        name: 'Фитинг ПВХ',
        quantity: 50,
        quantityCollected: 0,
        location: '12,05,00,00',
        status: OrderItemStatus.PENDING,
        availableQuantity: 100
      },
      {
        id: '2',
        sku: 'BV-50',
        name: 'Кран шаровый',
        quantity: 10,
        quantityCollected: 0,
        location: '12,05,01,00',
        status: OrderItemStatus.PENDING,
        availableQuantity: 15
      },
      {
        id: '3',
        sku: 'ABC-123',
        name: 'Заглушка',
        quantity: 5,
        quantityCollected: 0,
        location: '01,01,01,01',
        status: OrderItemStatus.PENDING,
        availableQuantity: 7
      }
    ],
    tasks: [],
    invoiceNumber: 'INV-001',
    customerName: 'ООО "ВодоканалСтрой"',
    customerContact: '+7 (999) 123-45-67',
    notes: '',
    progress: 0
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    status: OrderStatus.IN_PROGRESS,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      {
        id: '2',
        sku: 'BV-50',
        name: 'Кран шаровый',
        quantity: 10,
        quantityCollected: 8,
        location: '12,05,01,00',
        status: OrderItemStatus.IN_PROGRESS,
        availableQuantity: 15
      }
    ],
    tasks: [],
    invoiceNumber: 'INV-002',
    customerName: 'ООО "СантехМонтаж"',
    customerContact: '+7 (999) 765-43-21',
    notes: '',
    progress: 80
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [isExecutionDialogOpen, setIsExecutionDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const currentUserId = 'user1'; // В реальном приложении это будет из контекста авторизации
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'completed' | 'open'>('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCreateOrder = (newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => {
    const order: Order = {
      ...newOrder,
      id: (orders.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
    };
    setOrders([...orders, order]);
  };

  const handleCompleteOrder = (completedOrder: Order) => {
    setOrders(orders.map(order =>
      order.id === completedOrder.id ? completedOrder : order
    ));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return 'default';
      case OrderStatus.IN_PROGRESS:
        return 'info';
      case OrderStatus.ON_HOLD:
        return 'warning';
      case OrderStatus.COMPLETED:
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return <AssignmentIcon />;
      case OrderStatus.IN_PROGRESS:
        return <ShippingIcon />;
      case OrderStatus.ON_HOLD:
        return <WarningIcon />;
      case OrderStatus.COMPLETED:
        return <CheckCircleIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    if (statusFilter !== 'all') {
      if (statusFilter === 'new') filtered = filtered.filter(o => o.status === OrderStatus.NEW);
      if (statusFilter === 'in_progress') filtered = filtered.filter(o => o.status === OrderStatus.IN_PROGRESS);
      if (statusFilter === 'completed') filtered = filtered.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.ON_HOLD);
      if (statusFilter === 'open') filtered = filtered.filter(o => o.status === OrderStatus.NEW); // Открытые = новые
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(s) ||
        (o.customerName && o.customerName.toLowerCase().includes(s)) ||
        (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(s))
      );
    }
    return filtered;
  };

  const renderOrdersList = (filteredOrders: Order[]) => (
    <List>
      {filteredOrders.map((order) => (
        <ListItem
          key={order.id}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': { borderBottom: 'none' },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon(order.status)}
              <Typography component="span" variant="subtitle1">
                Заказ {order.orderNumber}
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
              <Typography component="span" variant="body2" color="text.secondary">
                Клиент: {order.customerName}
              </Typography>
              <Typography component="span" variant="body2" color="text.secondary">
                Накладная: {order.invoiceNumber}
              </Typography>
              <Typography component="span" variant="body2" color="text.secondary">
                Прогресс: {order.progress}%
              </Typography>
              {order.items && order.items.length > 0 && (
                <Box sx={{ mt: 1, ml: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Позиции:</Typography>
                  {order.items.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', gap: 2, ml: 1 }}>
                      <Typography variant="body2">{item.name} ({item.sku})</Typography>
                      <Typography variant="body2" color="success.main">В наличии: {item.availableQuantity}</Typography>
                      <Typography variant="body2" color="primary.main">Необходимо: {item.quantity}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              onClick={() => {
                setSelectedOrder(order);
                setIsExecutionDialogOpen(true);
              }}
            >
              <AssignmentIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <Typography variant="h5">Управление заказами</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewOrderDialogOpen(true)}
        >
          Новый заказ
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={e => setStatusFilter(e.target.value as any)}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="new">Новые</MenuItem>
            <MenuItem value="in_progress">В работе</MenuItem>
            <MenuItem value="completed">Завершённые</MenuItem>
            <MenuItem value="open">Открытые</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1 }}>
          <input
            type="text"
            placeholder="Поиск по номеру заказа, клиенту, накладной..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </Box>
      </Box>
      <Paper>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="order tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Все заказы" />
          <Tab label="Мои заказы" icon={<PersonIcon />} />
          <Tab label="Новые" />
          <Tab label="В работе" />
          <Tab label="Завершенные" />
          <Tab label="Открытые заказы" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          {renderOrdersList(getFilteredOrders())}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {renderOrdersList(getFilteredOrders().filter(order => order.assignedTo === currentUserId))}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {renderOrdersList(getFilteredOrders().filter(order => order.status === OrderStatus.NEW))}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {renderOrdersList(getFilteredOrders().filter(order => 
            order.status === OrderStatus.IN_PROGRESS
          ))}
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          {renderOrdersList(getFilteredOrders().filter(order =>
            order.status === OrderStatus.COMPLETED ||
            order.status === OrderStatus.ON_HOLD
          ))}
        </TabPanel>

        <TabPanel value={currentTab} index={5}>
          <List>
            {getFilteredOrders().filter(order => order.status === OrderStatus.NEW).map((order) => (
              <ListItem
                key={order.id}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon />
                    <Typography component="span" variant="subtitle1">
                      Заказ {order.orderNumber}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                    <Typography component="span" variant="body2" color="text.secondary">
                      Клиент: {order.customerName}
                    </Typography>
                    <Typography component="span" variant="body2" color="text.secondary">
                      Накладная: {order.invoiceNumber}
                    </Typography>
                  </Box>
                </Box>
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsExecutionDialogOpen(true);
                    }}
                  >
                    Перейти к заказу
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>

      <NewOrderDialog
        open={isNewOrderDialogOpen}
        onClose={() => setIsNewOrderDialogOpen(false)}
        onSubmit={handleCreateOrder}
      />

      {selectedOrder && (
        <OrderExecutionDialog
          open={isExecutionDialogOpen}
          onClose={() => setIsExecutionDialogOpen(false)}
          order={selectedOrder}
          onComplete={handleCompleteOrder}
        />
      )}
    </Box>
  );
};

export default OrderManager; 