import React, { useState, useMemo, useEffect } from 'react';
// @ts-ignore
import Fuse from 'fuse.js';
import { TextField, List, ListItem, ListItemText, Paper, Box, Typography } from '@mui/material';
import { db } from '../../config/supabase';

interface Product {
  SKU: string;
  NAMEIN_HEBREW: string;
  ADRESS_IN_WAREHOUSE: string;
}

// Тип результата поиска для совместимости с Fuse.js v6+
type FuseResult<T> = { item: T; score?: number };

const fuseOptions = {
  keys: ['NAMEIN_HEBREW', 'SKU', 'ADRESS_IN_WAREHOUSE'],
  threshold: 0.4,
  minMatchCharLength: 2,
  includeScore: true,
};

const FuzzyProductSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    db.getProducts().then(setProducts);
  }, []);

  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).slice(0, 20);
  }, [query, fuse]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Поиск товара (фаззи)</Typography>
      <TextField
        fullWidth
        label="Начните вводить название, артикул, адрес..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
        autoFocus
      />
      <Paper>
        <List>
          {results.length === 0 && query && (
            <ListItem>
              <ListItemText primary="Ничего не найдено" />
            </ListItem>
          )}
          {results.map((result: FuseResult<Product>) => (
            <ListItem key={result.item.SKU}>
              <ListItemText
                primary={result.item.NAMEIN_HEBREW}
                secondary={`SKU: ${result.item.SKU} | Адрес: ${result.item.ADRESS_IN_WAREHOUSE}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FuzzyProductSearch; 