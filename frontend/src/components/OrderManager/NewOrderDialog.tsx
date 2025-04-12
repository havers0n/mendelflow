import React, { useState } from 'react';
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
} from '@mui/material';
import { Order, OrderStatus } from '../../interfaces/Order';

interface NewOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => void;
}

const NewOrderDialog: React.FC<NewOrderDialogProps> = ({ open, onClose, onSubmit }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.NEW);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'progress'> = {
      orderNumber,
      status: OrderStatus.NEW,
      items: [],
      tasks: [],
      invoiceNumber,
      customerName,
      customerContact,
      notes
    };
    onSubmit(newOrder);
    handleClose();
  };

  const handleClose = () => {
    setOrderNumber('');
    setStatus(OrderStatus.NEW);
    setInvoiceNumber('');
    setCustomerName('');
    setCustomerContact('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать новый заказ</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Номер заказа"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={status}
              label="Статус"
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
            >
              {Object.values(OrderStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Номер накладной"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            fullWidth
          />

          <TextField
            label="Имя клиента"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Контакт клиента"
            value={customerContact}
            onChange={(e) => setCustomerContact(e.target.value)}
            fullWidth
          />

          <TextField
            label="Примечания"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!orderNumber || !customerName}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewOrderDialog; 