import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';

interface Module {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  modules: Module[];
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ modules, activeModule, onModuleChange }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          MendelFlow
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {modules.map((module) => (
            <ListItem key={module.id} disablePadding>
              <ListItemButton
                selected={activeModule === module.id}
                onClick={() => onModuleChange(module.id)}
              >
                <ListItemIcon>{module.icon}</ListItemIcon>
                <ListItemText primary={module.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 