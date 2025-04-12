import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  ShoppingCart as OrderIcon,
  People as PeopleIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import Dashboard from './components/Dashboard/Dashboard';
import TaskManager from './components/TaskManager/TaskManager';
import { mockUser } from './mocks/user';
import { Permission } from './interfaces/Role';
import { PermissionGuard } from './components/PermissionGuard/PermissionGuard';

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
  { id: 'users', title: 'Пользователи', icon: <PeopleIcon />, permission: Permission.MANAGE_USERS },
  { id: 'reports', title: 'Отчеты', icon: <ReportIcon />, permission: Permission.VIEW_REPORTS },
  { id: 'settings', title: 'Настройки', icon: <SettingsIcon /> },
];

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

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
            user={mockUser}
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
          <Typography variant="h6" noWrap component="div">
            {modules.find(m => m.id === activeModule)?.title || 'MendelFlow'}
          </Typography>
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
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default App; 