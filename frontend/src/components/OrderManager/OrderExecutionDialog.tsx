import React, { useState, useEffect, useCallback } from 'react';
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
import { Dialog as MuiDialog } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { supabase } from '../../supabaseClient';

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
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(order.items);
    setCurrentItemIndex(0);
    setCollectedQuantity(0);
  }, [order]);

  const currentItem = items[currentItemIndex];
  const progress = items.length > 0 ? (currentItemIndex / items.length) * 100 : 0;

  // Горячие клавиши
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'Enter') {
      handleTakeAll();
    } else if (e.key === 'ArrowRight') {
      if (collectedQuantity > 0 && currentItemIndex < items.length - 1) {
        // Сохраняем текущее количество и переходим к следующему товару
        processItem(undefined, true); // true = переход по стрелке
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentItemIndex > 0) {
        setCurrentItemIndex(currentItemIndex - 1);
        setCollectedQuantity(items[currentItemIndex - 1]?.quantityCollected || 0);
      }
    }
  }, [open, collectedQuantity, currentItemIndex, items]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleQuantityChange = (value: number) => {
    try {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        setError('Введите неотрицательное число');
        return;
      }
      if (numValue > currentItem.availableQuantity) {
        setError('Введено больше, чем есть в наличии!');
        return;
      }
      if (numValue > currentItem.quantity) {
        setError('Введено больше, чем требуется!');
        return;
      }
      setError(null);
      setCollectedQuantity(numValue);
    } catch (error) {
      setError('Ошибка при вводе количества');
    }
  };

  const handleTakeAll = () => {
    setCollectedQuantity(Math.min(currentItem.quantity, currentItem.availableQuantity));
    setError(null);
    // Логирование действия
    console.log(`[LOG] Взято всё: ${currentItem.name} (${currentItem.sku}), пользователь: ${order.assignedTo || 'неизвестно'}, время: ${new Date().toLocaleString()}`);
  };

  const handleNext = () => {
    if (!currentItem) return;
    if (collectedQuantity < currentItem.quantity) {
      setReasonDialogOpen(true);
      return;
    }
    processItem();
  };

  const processItem = (reason?: string, goNext?: boolean) => {
    const updatedItems = [...items];
    updatedItems[currentItemIndex] = {
      ...currentItem,
      quantityCollected: collectedQuantity,
      status: collectedQuantity === currentItem.quantity
        ? OrderItemStatus.COMPLETED
        : OrderItemStatus.OUT_OF_STOCK,
    };
    let updatedOrder = { ...order, items: updatedItems };
    // Логирование причины недобора
    if (reason) {
      console.log(`[LOG] Причина недобора: ${reason}, товар: ${currentItem.name} (${currentItem.sku}), пользователь: ${order.assignedTo || 'неизвестно'}, время: ${new Date().toLocaleString()}`);
    }
    // Если причина "Нет в ячейке" — добавляем задачу
    if (reason === 'Нет в ячейке') {
      updatedOrder.tasks = [...(order.tasks || []), `Проверить ячейку ${currentItem.location}`];
      // Логирование создания задачи
      console.log(`[LOG] Создана задача: Проверить ячейку ${currentItem.location}, пользователь: ${order.assignedTo || 'неизвестно'}, время: ${new Date().toLocaleString()}`);
    }
    if ((goNext || currentItemIndex < items.length - 1) && !reason) {
      setItems(updatedItems);
      setCurrentItemIndex(currentItemIndex + 1);
      setCollectedQuantity(updatedItems[currentItemIndex + 1]?.quantityCollected || 0);
    } else if (!reason) {
      // Проверяем все ли товары собраны полностью
      const allItemsCompleted = updatedItems.every(
        item => item.status === OrderItemStatus.COMPLETED
      );
      updatedOrder = {
        ...updatedOrder,
        status: allItemsCompleted ? OrderStatus.COMPLETED : OrderStatus.ON_HOLD,
        progress: Math.round(
          (updatedItems.reduce((sum, item) => sum + item.quantityCollected, 0) /
            updatedItems.reduce((sum, item) => sum + item.quantity, 0)) * 100
        ),
      };
      onComplete(updatedOrder);
      onClose();
    }
    setReasonDialogOpen(false);
    setSelectedReason('');
    setCustomReason('');
  };

  const joinQueue = async () => {
    setLoading(true);
    setError(null);
    // Вызов Edge Function или REST API для постановки в очередь
    const res = await fetch('/functions/v1/join-queue', {
      method: 'POST',
      body: JSON.stringify({ place: 'office1', phone: '1234567890' }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      setError('Ошибка при постановке в очередь');
      setLoading(false);
      return;
    }
    const data = await res.json();
    setQueueNumber(data.number);
    setLoading(false);
    checkPosition(data.number);
  };

  const checkPosition = async (number?: number) => {
    setLoading(true);
    setError(null);
    const myNumber = number ?? queueNumber;
    if (!myNumber) return;
    // Получаем очередь из Supabase
    const { data, error } = await supabase
      .from('queue')
      .select('number, status')
      .eq('place', 'office1')
      .eq('status', 'waiting')
      .order('number', { ascending: true });

    if (error) {
      setError('Ошибка при получении очереди');
      setLoading(false);
      return;
    }
    const numbers = data?.map((item: any) => item.number) || [];
    const pos = numbers.indexOf(myNumber);
    setPosition(pos >= 0 ? pos : null);
    setLoading(false);
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
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullScreen>
        <DialogTitle sx={{ fontSize: 32, textAlign: 'center', fontWeight: 'bold', letterSpacing: 1, pb: 2 }}>
          Выполнение заказа {order.orderNumber}
          <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, height: 10, borderRadius: 5 }} />
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Кнопка "Назад" */}
            <Button
              variant="outlined"
              color="primary"
              sx={{ minWidth: 56, minHeight: 56, borderRadius: '50%', fontSize: 32, p: 0, visibility: currentItemIndex === 0 ? 'hidden' : 'visible' }}
              onClick={() => {
                if (currentItemIndex > 0) {
                  setCurrentItemIndex(currentItemIndex - 1);
                  setCollectedQuantity(items[currentItemIndex - 1]?.quantityCollected || 0);
                }
              }}
              disabled={currentItemIndex === 0}
            >
              <ArrowBackIcon fontSize="inherit" />
            </Button>
            {/* Карточка товара */}
            <Paper sx={{ p: 4, width: '100%', maxWidth: 600, mb: 4, boxShadow: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                {currentItem.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                Артикул: {currentItem.sku}
              </Typography>
              {/* Место под фото/3D-модель */}
              <Box sx={{ width: 220, height: 180, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #bbb' }}>
                <Typography color="text.secondary">Фото/3D-модель</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: 20 }}>
                  Местоположение: <span style={{ color: '#1976d2', background: '#e3f2fd', borderRadius: 6, padding: '2px 10px', fontWeight: 700 }}>{currentItem.location}</span>
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 18 }}>
                  В наличии: <span style={{ color: '#388e3c', fontWeight: 700 }}>{currentItem.availableQuantity}</span>
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 18 }}>
                  Необходимо собрать: <span style={{ color: '#d32f2f', fontWeight: 700 }}>{currentItem.quantity}</span>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, width: '100%' }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Количество собрано</Typography>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <TextField
                    type="number"
                    value={collectedQuantity}
                    onChange={e => handleQuantityChange(Number(e.target.value))}
                    inputProps={{ min: 0, max: currentItem.quantity, style: { fontSize: 24, textAlign: 'center', width: 120 } }}
                    sx={{ mb: 1, '& input': { textAlign: 'center' } }}
                    error={!!error}
                    helperText={error}
                  />
                  <Button variant="contained" color="success" sx={{ height: 56, fontSize: 18 }} onClick={handleTakeAll}>
                    Взять всё
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  из {currentItem.quantity}
                </Typography>
              </Box>
            </Paper>
            {/* Кнопка "Вперёд" */}
            <Button
              variant="outlined"
              color="primary"
              sx={{ minWidth: 56, minHeight: 56, borderRadius: '50%', fontSize: 32, p: 0, visibility: currentItemIndex === items.length - 1 ? 'hidden' : 'visible' }}
              onClick={() => {
                if (collectedQuantity > 0 && currentItemIndex < items.length - 1) {
                  processItem(undefined, true);
                }
              }}
              disabled={currentItemIndex === items.length - 1 || collectedQuantity === 0}
            >
              <ArrowForwardIcon fontSize="inherit" />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
          <Button onClick={onClose} variant="outlined" color="error" sx={{ fontSize: 20, px: 4, py: 1.5, borderRadius: 3, mr: 2 }}>
            Отмена
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            disabled={collectedQuantity === 0}
            sx={{ fontSize: 20, px: 4, py: 1.5, borderRadius: 3 }}
          >
            {currentItemIndex < items.length - 1 ? 'Следующий товар' : 'Завершить заказ'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Модальное окно выбора причины */}
      <MuiDialog open={reasonDialogOpen} onClose={() => setReasonDialogOpen(false)}>
        <DialogTitle>Почему взяли не всё?</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Button variant={selectedReason === 'Нет в наличии' ? 'contained' : 'outlined'} onClick={() => setSelectedReason('Нет в наличии')}>Нет в наличии</Button>
            <Button variant={selectedReason === 'Нет в ячейке' ? 'contained' : 'outlined'} onClick={() => setSelectedReason('Нет в ячейке')}>Нет в ячейке</Button>
            <Button variant={selectedReason === 'Другое' ? 'contained' : 'outlined'} onClick={() => setSelectedReason('Другое')}>Другое</Button>
            {selectedReason === 'Другое' && (
              <TextField label="Комментарий" value={customReason} onChange={e => setCustomReason(e.target.value)} fullWidth />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReasonDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={() => processItem(selectedReason === 'Другое' ? customReason : selectedReason)}
            variant="contained"
            color="primary"
            disabled={!selectedReason || (selectedReason === 'Другое' && !customReason)}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </MuiDialog>
    </>
  );
};

export default OrderExecutionDialog; 