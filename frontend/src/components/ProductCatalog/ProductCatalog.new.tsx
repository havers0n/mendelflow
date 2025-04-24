import React, { useState, useMemo } from 'react';
import { Typography, Box, Select, MenuItem, TextField, Button, InputLabel, FormControl, Autocomplete } from '@mui/material';
import ProductCard from './ProductCard';
import { Product as BaseProduct } from '../../interfaces/Product';

// Расширенный интерфейс Product для фильтрации
interface Product extends BaseProduct {
  category: string;
  type: string;
  material: string;
  diameter: number;
  connectionType: string;
  brand: string;
  sku: string;
}

// Тип для фильтров
interface ProductFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onReset: () => void;
}

interface Filters {
  category?: string;
  type?: string;
  material?: string;
  diameter?: number;
  connectionType?: string;
  brands?: string[];
  sku?: string;
  keywords?: string;
}

// Примерные значения для фильтров
const categories = ['Водоснабжение', 'Канализация', 'Фитинги', 'Вентили и краны', 'Трубы', 'Санитарное оборудование', 'Прочее'];
const types = ['Кран', 'Фитинг', 'Труба', 'Вентиль', 'Сифон', 'Уплотнитель'];
const materials = ['Пластик', 'Металл', 'Резина', 'Комбинированные'];
const diameters = [
  { label: '1/2"', value: 15 },
  { label: '3/4"', value: 20 },
  { label: '1"', value: 25 },
  { label: '32 мм', value: 32 },
  { label: '40 мм', value: 40 },
  { label: '50 мм', value: 50 },
  { label: '63 мм', value: 63 },
];
const connectionTypes = ['Резьба внутренняя', 'Резьба наружная', 'Компрессионное', 'Сварное', 'Push-Fit'];
const brands = ['HUL', 'Sagiv', 'Yoam', 'Kisner', 'Golan'];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Труба 50мм Пластик',
    category: 'Трубы',
    type: 'Труба',
    material: 'Пластик',
    diameter: 50,
    connectionType: 'Сварное',
    brand: 'HUL',
    sku: 'T-50-P-HUL',
    compatibleWith: ['2', '3'],
    location: 'A-01-02-03',
    stock: 120,
    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Труба'
  },
  {
    id: '2',
    name: 'Фитинг угловой 50мм',
    category: 'Фитинги',
    type: 'Фитинг',
    material: 'Пластик',
    diameter: 50,
    connectionType: 'Сварное',
    brand: 'Sagiv',
    sku: 'F-50-P-S-90',
    compatibleWith: ['1'],
    location: 'A-01-03-01',
    stock: 45,
    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Фитинг'
  },
  {
    id: '3',
    name: 'Кран шаровый 1/2"',
    category: 'Вентили и краны',
    type: 'Кран',
    material: 'Металл',
    diameter: 15,
    connectionType: 'Резьба внутренняя',
    brand: 'Yoam',
    sku: 'V-15-M-Y',
    compatibleWith: [],
    location: 'B-02-01-04',
    stock: 30,
    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Кран'
  },
  {
    id: '4',
    name: 'Уплотнитель резиновый 40мм',
    category: 'Фитинги',
    type: 'Уплотнитель',
    material: 'Резина',
    diameter: 40,
    connectionType: 'Компрессионное',
    brand: 'Kisner',
    sku: 'S-40-R-K',
    compatibleWith: [],
    location: 'C-03-02-01',
    stock: 200,
    imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Уплотнитель'
  },
  {
    id: '5',
    name: 'Труба металлическая 25мм',
    category: 'Трубы',
    type: 'Труба',
    material: 'Металл',
    diameter: 25,
    connectionType: 'Резьба наружная',
    brand: 'Golan',
    sku: 'T-25-M-G',
    compatibleWith: [],
    location: 'A-02-01-05',
    stock: 15,
    imageUrl: 'https://via.placeholder.com/150/888888/FFFFFF?text=Труба'
  },
  {
    id: '6',
    name: 'Фитинг тройник 25мм',
    category: 'Фитинги',
    type: 'Фитинг',
    material: 'Металл',
    diameter: 25,
    connectionType: 'Резьба внутренняя',
    brand: 'Golan',
    sku: 'F-25-M-G-T',
    compatibleWith: ['5'],
    location: 'A-02-02-01',
    stock: 0,
    imageUrl: 'https://via.placeholder.com/150/00FFFF/000000?text=Тройник'
  }
];

// Компонент фильтров
const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, setFilters, onReset }) => {
  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>Фильтры</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Категория</InputLabel>
          <Select
            value={filters.category || ''}
            label="Категория"
            onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
            displayEmpty
          >
            <MenuItem value="">Все категории</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Тип</InputLabel>
          <Select
            value={filters.type || ''}
            label="Тип"
            onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
            displayEmpty
          >
            <MenuItem value="">Все типы</MenuItem>
            {types.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Материал</InputLabel>
          <Select
            value={filters.material || ''}
            label="Материал"
            onChange={(e) => setFilters({ ...filters, material: e.target.value || undefined })}
            displayEmpty
          >
            <MenuItem value="">Все материалы</MenuItem>
            {materials.map(material => (
              <MenuItem key={material} value={material}>{material}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Диаметр</InputLabel>
          <Select
            value={filters.diameter || ''}
            label="Диаметр"
            onChange={(e) => {
              const value = e.target.value;
              setFilters({ ...filters, diameter: value ? Number(value) : undefined });
            }}
            displayEmpty
          >
            <MenuItem value="">Все диаметры</MenuItem>
            {diameters.map(diameter => (
              <MenuItem key={diameter.value} value={diameter.value}>{diameter.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Тип соединения</InputLabel>
          <Select
            value={filters.connectionType || ''}
            label="Тип соединения"
            onChange={(e) => setFilters({ ...filters, connectionType: e.target.value || undefined })}
            displayEmpty
          >
            <MenuItem value="">Все типы соединений</MenuItem>
            {connectionTypes.map(connectionType => (
              <MenuItem key={connectionType} value={connectionType}>{connectionType}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <Autocomplete
            multiple
            options={brands}
            value={filters.brands || []}
            onChange={(_, newValue) => setFilters({ ...filters, brands: newValue.length ? newValue : undefined })}
            renderInput={(params) => <TextField {...params} label="Производители" />}
          />
        </FormControl>

        <TextField
          label="Артикул"
          value={filters.sku || ''}
          onChange={(e) => setFilters({ ...filters, sku: e.target.value || undefined })}
          sx={{ minWidth: 200 }}
        />

        <TextField
          label="Поиск по названию"
          value={filters.keywords || ''}
          onChange={(e) => setFilters({ ...filters, keywords: e.target.value || undefined })}
          sx={{ minWidth: 200 }}
        />

        <Button variant="outlined" onClick={onReset} sx={{ height: 56 }}>Сбросить</Button>
      </Box>
    </Box>
  );
};

const ProductCatalog: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({});
  const handleReset = () => setFilters({});
  
  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.type && product.type !== filters.type) return false;
      if (filters.material && product.material !== filters.material) return false;
      if (filters.diameter !== undefined && product.diameter !== filters.diameter) return false;
      if (filters.connectionType && product.connectionType !== filters.connectionType) return false;
      if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
      if (filters.sku && product.sku && !product.sku.toLowerCase().includes(filters.sku.toLowerCase())) return false;
      if (filters.keywords && product.name && !product.name.toLowerCase().includes(filters.keywords.toLowerCase())) return false;
      return true;
    });
  }, [filters]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Каталог товаров</Typography>
      <ProductFilters filters={filters} setFilters={setFilters} onReset={handleReset} />
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 2
      }}>
        {filteredProducts.map(product => (
          <Box key={product.id}>
            <ProductCard
              product={product}
              onShowDetails={() => {}}
              onShowLocation={() => {}}
              onAddToOrder={() => {}}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProductCatalog;

