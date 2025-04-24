import React from 'react';
import { Typography, Box, Button, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Product } from '../../interfaces/Product';

// Примерные данные для витрины
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Труба 50мм Пластик',
    material: 'Пластик',
    diameter: 50,
    type: 'Труба',
    compatibleWith: ['2', '3'],
    location: '',
    stock: 120,
    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Труба',
    price: 1200,
    description: 'Прочная пластиковая труба для водоснабжения.'
  },
  {
    id: '2',
    name: 'Фитинг угловой 50мм',
    material: 'Пластик',
    diameter: 50,
    type: 'Фитинг',
    compatibleWith: ['1'],
    location: '',
    stock: 45,
    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Фитинг',
    price: 350,
    description: 'Угловой фитинг для соединения труб.'
  },
];

const ProductCatalogPublic: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Каталог товаров</Typography>
      <Grid container spacing={3}>
        {mockProducts.map(product => (
          <Grid xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.description}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {product.price ? `${product.price} ₽` : 'Цена по запросу'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary">Купить</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductCatalogPublic; 