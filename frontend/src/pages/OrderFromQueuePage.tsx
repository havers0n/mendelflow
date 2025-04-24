import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';

// Мок-данные заказов
const MOCK_ORDERS = [
  { id: '1', number: 'ORD-001', client: 'Иванов И.И.', object: 'Стройка 1', phone: '+972543558731' },
  { id: '2', number: 'ORD-002', client: 'Петров П.П.', object: 'Проект X', phone: '+79991234567' },
  { id: '3', number: 'ORD-003', client: 'ООО "Рога и Копыта"', object: 'Объект Z', phone: '+79997654321' },
];

interface Props {
  phone: string;
}

const OrderFromQueuePage: React.FC<Props> = ({ phone }) => {
  const [search, setSearch] = useState(phone);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [newOrder, setNewOrder] = useState({
    client: '',
    object: '',
    phone: phone,
  });
  const [created, setCreated] = useState(false);

  const filtered = MOCK_ORDERS.filter(
    o =>
      o.phone.includes(search) ||
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.object.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedOrder) {
    return (
      <Box sx={{ maxWidth: 600, margin: '40px auto', p: 4, bgcolor: '#fff', borderRadius: 4, boxShadow: '0 2px 12px #eee' }}>
        <Typography variant="h5" gutterBottom>Оформление заказа</Typography>
        <Typography>Выбран заказ: <b>{selectedOrder.number}</b> — {selectedOrder.client}, {selectedOrder.object}</Typography>
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>Здесь будет форма оформления заказа...</Typography>
        <Button sx={{ mt: 3 }} variant="outlined" onClick={() => setSelectedOrder(null)}>Назад к поиску</Button>
      </Box>
    );
  }

  if (creating) {
    if (created) {
      return (
        <Box sx={{ maxWidth: 600, margin: '40px auto', p: 4, bgcolor: '#fff', borderRadius: 4, boxShadow: '0 2px 12px #eee' }}>
          <Typography variant="h5" gutterBottom>Заказ успешно создан!</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Дальнейшее оформление заказа будет реализовано позже.</Typography>
          <Button sx={{ mt: 3 }} variant="outlined" onClick={() => { setCreating(false); setCreated(false); }}>Назад к поиску</Button>
        </Box>
      );
    }
    return (
      <Box sx={{ maxWidth: 600, margin: '40px auto', p: 4, bgcolor: '#fff', borderRadius: 4, boxShadow: '0 2px 12px #eee' }}>
        <Typography variant="h5" gutterBottom>Создание нового заказа для {phone}</Typography>
        <form onSubmit={e => { e.preventDefault(); setCreated(true); }}>
          <TextField
            label="Имя клиента"
            value={newOrder.client}
            onChange={e => setNewOrder({ ...newOrder, client: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Объект"
            value={newOrder.object}
            onChange={e => setNewOrder({ ...newOrder, object: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Телефон"
            value={newOrder.phone}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">Сохранить</Button>
        </form>
        <Button sx={{ mt: 3, ml: 2 }} variant="outlined" onClick={() => setCreating(false)}>Назад к поиску</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '40px auto', p: 4, bgcolor: '#fff', borderRadius: 4, boxShadow: '0 2px 12px #eee' }}>
      <Typography variant="h4" gutterBottom>Оформление заказа для клиента</Typography>
      <TextField
        label="Поиск по номеру заказа, имени клиента, объекту или телефону"
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setCreating(true)}>
        Создать новый заказ для {phone}
      </Button>
      <Paper variant="outlined">
        <List>
          {filtered.length === 0 && <ListItem><ListItemText primary="Ничего не найдено" /></ListItem>}
          {filtered.map(order => (
            <React.Fragment key={order.id}>
              <ListItem component="button" onClick={() => setSelectedOrder(order)}>
                <ListItemText
                  primary={`Заказ ${order.number}`}
                  secondary={`${order.client} — ${order.object} — ${order.phone}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default OrderFromQueuePage; 