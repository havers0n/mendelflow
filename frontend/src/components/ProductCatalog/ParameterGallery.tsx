import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

export interface GalleryOption {
  key: string;
  label: string;
  icon?: string; // путь к иконке или emoji
}

export interface ParameterGalleryProps {
  step: 'material' | 'type' | 'diameter' | 'connection';
  options: GalleryOption[];
  onSelect: (option: GalleryOption) => void;
  title?: string;
  selectedKey?: string | null;
}

const ParameterGallery: React.FC<ParameterGalleryProps> = ({ step, options, onSelect, title, selectedKey }) => {
  return (
    <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom>{title || 'Choose parameter'}</Typography>
      <Grid container spacing={2}>
        {options.map(option => (
          <Grid xs={6} sm={4} md={3} key={option.key}>
            <Button
              variant={selectedKey === option.key ? 'contained' : 'outlined'}
              sx={{
                width: '100%',
                height: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                gap: 1,
                bgcolor: selectedKey === option.key ? 'primary.light' : undefined,
                color: selectedKey === option.key ? 'primary.contrastText' : undefined,
              }}
              onClick={() => onSelect(option)}
            >
              <span style={{ fontSize: 36 }}>{option.icon || '🔘'}</span>
              <span>{option.label}</span>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ParameterGallery; 