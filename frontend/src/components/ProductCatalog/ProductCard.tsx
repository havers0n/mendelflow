import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Button, Box } from '@mui/material';
import { Product } from '../../interfaces/Product';

interface Props {
  product: Product;
  onShowDetails: () => void;
  onShowLocation: () => void;
  onAddToOrder: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onShowDetails, onShowLocation, onAddToOrder }) => (
  <Card sx={{ maxWidth: 345, m: 1, position: 'relative' }}>
    {product.imageUrl && (
      <CardMedia
        component="img"
        height="140"
        image={product.imageUrl}
        alt={product.name}
      />
    )}
    <CardContent>
      <Typography gutterBottom variant="h6" component="div">
        {product.name}
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Chip label={product.material || '—'} size="small" sx={{ mr: 1 }} />
        <Chip label={product.diameter ? `${product.diameter} мм` : '—'} size="small" sx={{ mr: 1 }} />
        <Chip label={product.type || '—'} size="small" />
        {product.engraved && <Chip label="Гравировка" color="secondary" size="small" sx={{ ml: 1 }} />}
      </Box>
      <Typography variant="body2" color="text.secondary">
        На складе: {product.stock > 0 ? product.stock : <span style={{color: 'red'}}>Нет в наличии</span>}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button size="small" onClick={onShowDetails}>Подробнее</Button>
        <Button size="small" onClick={onShowLocation}>На карте</Button>
        <Button size="small" variant="contained" disabled={product.stock === 0} onClick={onAddToOrder}>
          В заказ
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default ProductCard; 