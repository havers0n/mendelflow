import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Container,
  ListItemButton,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  ShoppingCart as OrderIcon,
  People as PeopleIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Dashboard from './components/Dashboard/Dashboard';
import TaskManager from './components/TaskManager/TaskManager';
import { Permission } from './interfaces/Role';
import { PermissionGuard } from './components/PermissionGuard/PermissionGuard';
import ProductCatalog from './components/ProductCatalog/ProductCatalog';
import LoginForm from './components/Auth/LoginForm';
import { supabase } from './config/supabase';
import { db } from './config/supabase';
import OrderManager from './components/OrderManager/OrderManager';
import QueuePage from './pages/QueuePage';
import WorkerQueuePage from './pages/WorkerQueuePage';
import { Routes, Route } from 'react-router-dom';

const drawerWidth = 240;

interface Module {
  id: string;
  title: string;
  icon: React.ReactNode;
  permission?: Permission;
}

const modules: Module[] = [
  { id: 'dashboard', title: 'Дашборд', icon: <DashboardIcon />, permission: Permission.VIEW_TASKS },
  { id: 'tasks', title: 'Управление задачами', icon: <TaskIcon />, permission: Permission.VIEW_TASKS },
  { id: 'orders', title: 'Управление заказами', icon: <OrderIcon />, permission: Permission.VIEW_ORDERS },
  { id: 'catalog', title: 'Каталог товаров', icon: <OrderIcon />, permission: Permission.VIEW_TASKS },
  { id: 'users', title: 'Пользователи', icon: <PeopleIcon />, permission: Permission.MANAGE_USERS },
  { id: 'reports', title: 'Отчеты', icon: <ReportIcon />, permission: Permission.VIEW_REPORTS },
  { id: 'settings', title: 'Настройки', icon: <SettingsIcon /> },
];

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получить пользователя из таблицы users по email
  const fetchUserFromDb = async (email: string) => {
    console.log('[fetchUserFromDb] start, email:', email);
    let timeoutId: any;
    try {
      setError(null);
      setLoading(true);
      // Таймаут на 20 секунд
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Таймаут запроса к Supabase (20 секунд)')), 20000);
      });
      const dbUserPromise = db.getUserByEmail(email);
      const dbUser = await Promise.race([dbUserPromise, timeoutPromise]);
      console.log('[fetchUserFromDb] dbUser:', dbUser);
      if (!dbUser) {
        setError('Пользователь с таким email не найден в базе данных.');
        setUser(null);
      } else {
        setUser(dbUser);
      }
    } catch (err: any) {
      console.error('[fetchUserFromDb] error:', err);
      setError('Ошибка при загрузке пользователя: ' + (err.message || err.toString()));
      setUser(null);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      console.log('[fetchUserFromDb] finally, loading=false');
    }
  };

  // Проверять пользователя только при загрузке приложения
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const email = data?.user?.email;
      if (email) {
        await fetchUserFromDb(email);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  // Функция для повторной попытки загрузки пользователя
  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    const email = data?.user?.email;
    if (email) {
      await fetchUserFromDb(email);
    } else {
      setUser(null);
      setLoading(false);
    }
  };

  // DEBUG: user в AppBar
  console.log('user in AppBar:', user);

  if (loading) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}><Typography>Загрузка...</Typography></Box>;
  }

  if (error) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
      <Box sx={{ p: 4, border: '1px solid #f44336', borderRadius: 2, bgcolor: '#fff' }}>
        <Typography color="error" variant="h6" mb={2}>Ошибка</Typography>
        <Typography color="error" mb={2}>{error}</Typography>
        <Button variant="contained" color="primary" onClick={handleRetry}>Повторить попытку</Button>
      </Box>
    </Box>;
  }

  // Если пользователь не авторизован, показываем только форму входа
  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
        <LoginForm onLogin={async () => {
          const { data } = await supabase.auth.getUser();
          const email = data?.user?.email;
          if (email) {
            await fetchUserFromDb(email);
          }
        }} />
      </Box>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(true);
    // После выхода пробуем получить пользователя (будет null)
    const { data } = await supabase.auth.getUser();
    const email = data?.user?.email;
    if (email) {
      await fetchUserFromDb(email);
    } else {
      setUser(null);
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <TaskManager />
          </Container>
        );
      case 'orders':
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <OrderManager />
          </Container>
        );
      case 'catalog':
        return <ProductCatalog />;
      default:
        return (
          <Container>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4">
                {modules.find(m => m.id === activeModule)?.title || 'Страница не найдена'}
              </Typography>
            </Box>
          </Container>
        );
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          MendelFlow
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {modules.map((module) => (
          <PermissionGuard
            key={module.id}
            user={user}
            permissions={module.permission || []}
            fallback={null}
          >
            <ListItemButton
              selected={activeModule === module.id}
              onClick={() => setActiveModule(module.id)}
            >
              <ListItemIcon>{module.icon}</ListItemIcon>
              <ListItemText primary={module.title} />
            </ListItemButton>
          </PermissionGuard>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton 
          onClick={handleLogout}
          sx={{ 
            bgcolor: 'error.main', 
            color: 'white',
            my: 2,
            mx: 1,
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'error.dark',
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'white', fontSize: 30 }} />
          </ListItemIcon>
          <ListItemText 
            primary="ВЫЙТИ" 
            primaryTypographyProps={{ 
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }} 
          />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {modules.find((m) => m.id === activeModule)?.title || 'MendelFlow'}
          </Typography>
          {/* DEBUG-текст */}
          <Typography sx={{ color: 'red', fontWeight: 'bold', fontSize: 24, mr: 2 }}>
            DEBUG: APPBAR RENDERS
          </Typography>
          {/* ВРЕМЕННЫЙ ОТЛАДОЧНЫЙ ВЫВОД user */}
          <Typography variant="body2" sx={{ color: 'yellow', bgcolor: 'black', px: 2, borderRadius: 1, mr: 2 }}>
            {user ? `user: ${user.email || user.id}` : 'нет пользователя'}
          </Typography>
          {/* Кнопка выхода ВСЕГДА видна для отладки */}
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
              px: 3,
              ml: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: '#d32f2f',
                transform: 'scale(1.05)'
              }
            }}
            startIcon={<LogoutIcon sx={{ fontSize: 30 }} />}
          >
            ВЫЙТИ
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Routes>
          <Route path="/dashboard/queue" element={<WorkerQueuePage />} />
          <Route path="/queue/:place" element={<QueuePage />} />
          <Route path="*" element={renderContent()} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;