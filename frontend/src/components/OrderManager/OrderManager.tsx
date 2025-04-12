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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Управление заказами</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewOrderDialogOpen(true)}
        >
          Новый заказ
        </Button>
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
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          {renderOrdersList(orders)}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {renderOrdersList(orders.filter(order => order.assignedTo === currentUserId))}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {renderOrdersList(orders.filter(order => order.status === OrderStatus.NEW))}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {renderOrdersList(orders.filter(order => 
            order.status === OrderStatus.IN_PROGRESS
          ))}
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          {renderOrdersList(orders.filter(order =>
            order.status === OrderStatus.COMPLETED ||
            order.status === OrderStatus.ON_HOLD
          ))}
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