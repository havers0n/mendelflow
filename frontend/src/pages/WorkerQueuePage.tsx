import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Stack } from '@mui/material';

const QUEUE_PLACE = 'office1';

interface QueueItem {
  id: number;
  number: number;
  phone: string;
  status: string;
  notified: boolean;
}

const statusLabels: Record<string, string> = {
  waiting: 'Ожидает',
  called: 'Вызван',
  processing: 'Обслуживается',
  done: 'Завершён',
  skipped: 'Пропущен',
  cancelled: 'Отменён',
};

const WorkerQueuePage: React.FC = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('queue')
      .select('id, number, phone, status, notified')
      .eq('place', QUEUE_PLACE)
      .order('number', { ascending: true });
    if (error) {
      setError('Ошибка при получении очереди');
      setQueue([]);
    } else {
      setQueue(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Действия
  const handleCall = async (item: QueueItem) => {
    setActionLoading(item.id);
    // Здесь должна быть реальная отправка SMS через backend/edge function
    alert(`SMS отправлено на ${item.phone}: Вас вызывают!`);
    await supabase
      .from('queue')
      .update({ status: 'called', notified: true })
      .eq('id', item.id);
    await fetchQueue();
    setActionLoading(null);
  };

  const handleDone = async (item: QueueItem) => {
    setActionLoading(item.id);
    await supabase
      .from('queue')
      .update({ status: 'done' })
      .eq('id', item.id);
    await fetchQueue();
    setActionLoading(null);
  };

  const handleSkip = async (item: QueueItem) => {
    setActionLoading(item.id);
    await supabase
      .from('queue')
      .update({ status: 'skipped' })
      .eq('id', item.id);
    await fetchQueue();
    setActionLoading(null);
  };

  const handleReturn = async (item: QueueItem) => {
    setActionLoading(item.id);
    await supabase
      .from('queue')
      .update({ status: 'waiting' })
      .eq('id', item.id);
    await fetchQueue();
    setActionLoading(null);
  };

  const handleCancel = async (item: QueueItem) => {
    setActionLoading(item.id);
    await supabase
      .from('queue')
      .update({ status: 'cancelled' })
      .eq('id', item.id);
    await fetchQueue();
    setActionLoading(null);
  };

  return (
    <Box sx={{ maxWidth: 900, margin: '40px auto', padding: 4, borderRadius: 4, boxShadow: '0 2px 12px #eee', background: '#fff' }}>
      <Typography variant="h4" gutterBottom>
        Очередь (для работников)
      </Typography>
      <Button variant="contained" onClick={fetchQueue} sx={{ mb: 2 }} disabled={loading}>
        {loading ? 'Обновление...' : 'Обновить'}
      </Button>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : queue.length === 0 ? (
        <Typography variant="body1" color="text.secondary">Очередь пуста.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№ в очереди</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{statusLabels[item.status] || item.status}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {/* Вызвать — только для первого waiting */}
                      {item.status === 'waiting' && idx === 0 && (
                        <Button size="small" variant="contained" color="primary" onClick={() => handleCall(item)} disabled={actionLoading === item.id}>
                          {actionLoading === item.id ? '...' : 'Вызвать'}
                        </Button>
                      )}
                      {/* Завершить — для called/processing */}
                      {(item.status === 'called' || item.status === 'processing') && (
                        <Button size="small" variant="contained" color="success" onClick={() => handleDone(item)} disabled={actionLoading === item.id}>
                          {actionLoading === item.id ? '...' : 'Завершить'}
                        </Button>
                      )}
                      {/* Пропустить — только для called */}
                      {item.status === 'called' && (
                        <Button size="small" variant="outlined" color="warning" onClick={() => handleSkip(item)} disabled={actionLoading === item.id}>
                          {actionLoading === item.id ? '...' : 'Пропустить'}
                        </Button>
                      )}
                      {/* Вернуть — только для skipped */}
                      {item.status === 'skipped' && (
                        <Button size="small" variant="outlined" color="info" onClick={() => handleReturn(item)} disabled={actionLoading === item.id}>
                          {actionLoading === item.id ? '...' : 'Вернуть'}
                        </Button>
                      )}
                      {/* Отменить — для любого */}
                      {item.status !== 'done' && item.status !== 'cancelled' && (
                        <Button size="small" variant="text" color="error" onClick={() => handleCancel(item)} disabled={actionLoading === item.id}>
                          {actionLoading === item.id ? '...' : 'Отменить'}
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default WorkerQueuePage; 