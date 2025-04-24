import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Snackbar, Alert, Container } from '@mui/material';
import { Task } from '../../interfaces/Task';
import TaskList from './TaskList';
import { mockUser } from '../../mocks/user';
import { db } from '../../config/supabase';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const handleError = (error: unknown, defaultMessage: string) => {
    // Suppress logging during tests
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error details:', error);
    }
    const message = error instanceof Error ? error.message : defaultMessage;
    setError(message);
    showSnackbar(message, 'error');
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await db.getTasks();
      setTasks(data);
    } catch (error) {
      handleError(error, 'Произошла ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTaskCreate = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      console.log('Creating task with data:', task);
      const newTask = await db.createTask({
        ...task,
        orderNumber: task.orderNumber || '',
      });
      console.log('Task created successfully:', newTask);
      setTasks(prev => [newTask, ...prev]);
      showSnackbar('Задача успешно создана', 'success');
    } catch (error) {
      console.error('Error in handleTaskCreate:', error);
      handleError(error, 'Произошла ошибка при создании задачи');
      throw error;
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      setError(null);
      console.log('Updating task:', { taskId, updates });
      const updatedTask = await db.updateTask(taskId, updates);
      console.log('Task updated successfully:', updatedTask);
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      showSnackbar('Задача успешно обновлена', 'success');
    } catch (error) {
      console.error('Error in handleTaskUpdate:', error);
      handleError(error, 'Произошла ошибка при обновлении задачи');
      throw error;
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      setError(null);
      console.log('Deleting task:', taskId);
      await db.deleteTask(taskId);
      console.log('Task deleted successfully');
      setTasks(prev => prev.filter(task => task.id !== taskId));
      showSnackbar('Задача успешно удалена', 'success');
    } catch (error) {
      console.error('Error in handleTaskDelete:', error);
      handleError(error, 'Произошла ошибка при удалении задачи');
      throw error;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <TaskList
        tasks={tasks}
        currentUser={mockUser}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TaskManager; 