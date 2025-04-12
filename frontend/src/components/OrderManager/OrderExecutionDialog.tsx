import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  TextField,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import { Order, OrderItem, OrderStatus, OrderItemStatus } from '../../interfaces/Order';

interface OrderExecutionDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  onComplete: (order: Order) => void;
}

const OrderExecutionDialog: React.FC<OrderExecutionDialogProps> = ({
  open,
  onClose,
  order,
  onComplete,
}) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [items, setItems] = useState<OrderItem[]>(order.items);
  const [collectedQuantity, setCollectedQuantity] = useState(0);

  useEffect(() => {
    setItems(order.items);
    setCurrentItemIndex(0);
    setCollectedQuantity(0);
  }, [order]);

  const currentItem = items[currentItemIndex];
  const progress = items.length > 0 ? (currentItemIndex / items.length) * 100 : 0;

  const handleQuantityChange = (value: number) => {
    try {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= currentItem.quantity) {
        setCollectedQuantity(numValue);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleNext = () => {
    if (!currentItem) return;

    try {
      const updatedItems = [...items];
      updatedItems[currentItemIndex] = {
        ...currentItem,
        quantityCollected: collectedQuantity,
        status: collectedQuantity === currentItem.quantity
          ? OrderItemStatus.COMPLETED
          : OrderItemStatus.OUT_OF_STOCK,
      };

      setItems(updatedItems);

      if (currentItemIndex < items.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
        setCollectedQuantity(0);
      } else {
        // Проверяем все ли товары собраны полностью
        const allItemsCompleted = updatedItems.every(
          item => item.status === OrderItemStatus.COMPLETED
        );

        const completedOrder = {
          ...order,
          items: updatedItems,
          status: allItemsCompleted ? OrderStatus.COMPLETED : OrderStatus.ON_HOLD,
          progress: Math.round(
            (updatedItems.reduce((sum, item) => sum + item.quantityCollected, 0) /
              updatedItems.reduce((sum, item) => sum + item.quantity, 0)) * 100
          ),
        };
        onComplete(completedOrder);
        onClose();
      }
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  // Проверяем наличие items и currentItem
  if (!items.length || !currentItem) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ошибка</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Не удалось загрузить данные заказа. Пожалуйста, попробуйте позже.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Выполнение заказа {order.orderNumber}
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack spacing={2}>
              <Box>
                <Typography component="div" variant="subtitle2" color="text.secondary">
                  Товар {currentItemIndex + 1} из {items.length}
                </Typography>
                <Typography component="div" variant="h6">{currentItem.name}</Typography>
                <Typography component="div" variant="body2" color="text.secondary">
                  Артикул: {currentItem.sku}
                </Typography>
              </Box>

              <Box>
                <Typography component="div" variant="subtitle2">Местоположение</Typography>
                <Chip label={currentItem.location} />
              </Box>

              <Box>
                <Typography component="div" variant="subtitle2">Количество</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    type="number"
                    label="Собрано"
                    value={collectedQuantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                    size="small"
                  />
                  <Typography component="div" variant="body2" color="text.secondary">
                    из {currentItem.quantity}
                  </Typography>
                </Stack>
                <Typography component="div" variant="caption" color="text.secondary">
                  В наличии: {currentItem.availableQuantity}
                </Typography>
              </Box>

              {currentItem.imageUrl && (
                <Box>
                  <Typography component="div" variant="subtitle2">Изображение</Typography>
                  <Box
                    component="img"
                    src={currentItem.imageUrl}
                    alt={currentItem.name}
                    sx={{ maxWidth: '100%', maxHeight: 200 }}
                  />
                </Box>
              )}

              {currentItem.description && (
                <Box>
                  <Typography component="div" variant="subtitle2">Описание</Typography>
                  <Typography component="div" variant="body2">{currentItem.description}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleNext}
          variant="contained"
          color="primary"
          disabled={collectedQuantity === 0}
        >
          {currentItemIndex < items.length - 1 ? 'Следующий товар' : 'Завершить заказ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderExecutionDialog; 