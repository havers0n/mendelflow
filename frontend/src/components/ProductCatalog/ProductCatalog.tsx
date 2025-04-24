import React, { useState, useMemo, useEffect } from 'react';
import { Typography, Box, Select, MenuItem, TextField, Button, InputLabel, FormControl, Autocomplete, Chip, Stack, Paper, List, ListItem, ListItemText } from '@mui/material';
// ВАЖНО: В MUI v7 стандартный Grid не поддерживает item/container. Используем Unstable_Grid2 для полной совместимости с привычным API.
import Grid from '@mui/material/Unstable_Grid2';

import ProductCard from './ProductCard';
import { Product as BaseProduct } from '../../interfaces/Product';
import { db } from '../../config/supabase';
import ParameterGallery, { GalleryOption } from './ParameterGallery';
// @ts-ignore
import Fuse from 'fuse.js';

// Расширенный интерфейс Product для фильтрации
interface Product extends BaseProduct {
  category: string;
  type: string;
  material: string;
  diameter: number;
  connectionType: string;
  brand: string;
  sku: string;
  productgroup?: string;
  subgroup?: string;
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
  diameterMin?: number;
  diameterMax?: number;
  diameterUnit?: string;
  shape?: string;
  diametersInput?: string;
  productgroup?: string;
  subgroup?: string;
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
    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Труба',
    productgroup: 'Группа 1',
    subgroup: 'Подгруппа 1'
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
    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Фитинг',
    productgroup: 'Группа 1',
    subgroup: 'Подгруппа 1'
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
    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Кран',
    productgroup: 'Группа 2',
    subgroup: 'Подгруппа 2'
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
    imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Уплотнитель',
    productgroup: 'Группа 2',
    subgroup: 'Подгруппа 2'
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
    imageUrl: 'https://via.placeholder.com/150/888888/FFFFFF?text=Труба',
    productgroup: 'Группа 3',
    subgroup: 'Подгруппа 3'
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
    imageUrl: 'https://via.placeholder.com/150/00FFFF/000000?text=Тройник',
    productgroup: 'Группа 3',
    subgroup: 'Подгруппа 3'
  }
];

const materialOptions: GalleryOption[] = [
  { key: 'brass', label: 'Латунь', icon: '🥇' },
  { key: 'plastic', label: 'Пластик', icon: '🧪' },
  { key: 'steel', label: 'Сталь', icon: '🔩' },
  { key: 'rubber', label: 'Резина', icon: '⚫' },
];

const diameterOptions: GalleryOption[] = diameters.map(d => ({
  key: d.value.toString(),
  label: d.label,
  icon: '⭕',
}));

// Тип результата поиска для совместимости с Fuse.js v6+
type FuseResult<T> = { item: T; score?: number };

const fuseOptions = {
  keys: ['namein_hebrew', 'sku', 'adress_in_warehouse'],
  threshold: 0.4,
  minMatchCharLength: 2,
  includeScore: true,
};

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]); // any, т.к. структура из базы
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [selectedParams, setSelectedParams] = useState({
    material: null as string | null,
    type: null as string | null,
    diameter: null as string | null,
    connection: null as string | null,
  });
  const [query, setQuery] = useState('');

  useEffect(() => {
    db.getProducts()
      .then(data => {
        // Маппинг: преобразуем поля из базы в нужные для карточки
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.namein_hebrew || '',
          namein_hebrew: item.namein_hebrew || '',
          sku: item.sku || '',
          adress_in_warehouse: item.adress_in_warehouse || '',
          material: '',
          diameter: '',
          type: '',
          stock: 0,
          location: item.adress_in_warehouse || '',
          imageUrl: '',
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(e => {
        setError('Ошибка загрузки товаров');
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

  const fuzzyResults = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).slice(0, 20);
  }, [query, fuse]);

  const allGroups = Array.from(new Set(products.map(p => p.productgroup).filter(Boolean)));
  const allSubgroups = (group: string) => Array.from(new Set(products.filter(p => p.productgroup === group).map(p => p.subgroup).filter(Boolean)));

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.type && product.type !== filters.type) return false;
      if (filters.material && product.material !== filters.material) return false;
      if (filters.diameterMin !== undefined && product.diameter < filters.diameterMin) return false;
      if (filters.diameterMax !== undefined && product.diameter > filters.diameterMax) return false;
      if (filters.diameterUnit && product.diameterUnit && product.diameterUnit !== filters.diameterUnit) return false;
      if (filters.connectionType && product.connectionType !== filters.connectionType) return false;
      if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
      if (filters.sku && product.sku && !product.sku.toLowerCase().includes(filters.sku.toLowerCase())) return false;
      if (filters.keywords && product.name && !product.name.toLowerCase().includes(filters.keywords.toLowerCase())) return false;
      if (filters.shape && product.shape !== filters.shape) return false;
      if (filters.diametersInput) {
        const inputArr = filters.diametersInput.split(',').map(s => Number(s.trim())).filter(Boolean);
        if (!product.diameters || product.diameters.length !== inputArr.length || !product.diameters.every((d: number, i: number) => d === inputArr[i])) return false;
      }
      if (filters.productgroup && product.productgroup !== filters.productgroup) return false;
      if (filters.subgroup && product.subgroup !== filters.subgroup) return false;
      return true;
    });
  }, [products, filters]);

  // Опции для типа и диаметра на основе выбранного материала/типа
  const typeOptions: GalleryOption[] = useMemo(() => {
    if (!selectedParams.material) return [];
    const typesSet = new Set(
      mockProducts
        .filter(p => p.material === selectedParams.material)
        .map(p => p.type)
    );
    return Array.from(typesSet).map(type => ({ key: type, label: type }));
  }, [selectedParams.material]);

  const diameterOptionsStep: GalleryOption[] = useMemo(() => {
    if (!selectedParams.material || !selectedParams.type) return [];
    const diamSet = new Set(
      mockProducts
        .filter(p => p.material === selectedParams.material && p.type === selectedParams.type)
        .map(p => p.diameter)
    );
    return Array.from(diamSet).map(d => ({ key: d.toString(), label: d.toString(), icon: '⭕' }));
  }, [selectedParams.material, selectedParams.type]);

  // Функции для сброса фильтров
  const resetAllParams = () => {
    setSelectedParams({ material: null, type: null, diameter: null, connection: null });
  };
  const resetParam = (param: keyof typeof selectedParams) => {
    setSelectedParams(prev => ({ ...prev, [param]: null }));
  };

  // Синхронизация выбранных параметров галереи с фильтрами
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      material: selectedParams.material || undefined,
      type: selectedParams.type || undefined,
      diameter: selectedParams.diameter ? Number(selectedParams.diameter) : undefined,
    }));
    // eslint-disable-next-line
  }, [selectedParams.material, selectedParams.type, selectedParams.diameter]);

  // Визуализация выбранных параметров (chips)
  const selectedChips = [
    selectedParams.material && {
      key: 'material',
      label: selectedParams.material,
      onDelete: () => resetParam('material'),
    },
    selectedParams.type && {
      key: 'type',
      label: selectedParams.type,
      onDelete: () => resetParam('type'),
    },
    selectedParams.diameter && {
      key: 'diameter',
      label: selectedParams.diameter,
      onDelete: () => resetParam('diameter'),
    },
  ].filter(Boolean);

  // Галерея шагов
  function renderGalleryStep() {
    if (!selectedParams.material) {
      return (
        <ParameterGallery
          step="material"
          options={materialOptions}
          onSelect={option => {
            setSelectedParams(prev => ({ ...prev, material: option.label, type: null, diameter: null, connection: null }));
          }}
          title="Выберите материал (шаг 1 из 4)"
        />
      );
    }
    if (!selectedParams.type) {
      return (
        <ParameterGallery
          step="type"
          options={typeOptions}
          onSelect={option => {
            setSelectedParams(prev => ({ ...prev, type: option.label, diameter: null, connection: null }));
          }}
          title="Выберите тип (шаг 2 из 4)"
        />
      );
    }
    if (!selectedParams.diameter) {
      return (
        <ParameterGallery
          step="diameter"
          options={diameterOptionsStep}
          onSelect={option => {
            setSelectedParams(prev => ({ ...prev, diameter: option.label, connection: null }));
          }}
          title="Выберите диаметр (шаг 3 из 4)"
        />
      );
    }
    // Можно добавить шаг соединения, если нужно
    // if (!selectedParams.connection) { ... }
    return null;
  }

  if (loading) return <Typography>Загрузка товаров...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleReset = () => setFilters({});
  
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
              onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
              label="Категория"
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
              onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
              label="Тип"
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
              onChange={(e) => setFilters({ ...filters, material: e.target.value || undefined })}
              label="Материал"
            >
              <MenuItem value="">Все материалы</MenuItem>
              {materials.map(material => (
                <MenuItem key={material} value={material}>{material}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Диаметр</InputLabel>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
              <TextField
                label="от"
                type="number"
                value={filters.diameterMin || ''}
                onChange={e => setFilters({ ...filters, diameterMin: e.target.value ? Number(e.target.value) : undefined })}
                size="small"
                sx={{ width: 80 }}
              />
              <TextField
                label="до"
                type="number"
                value={filters.diameterMax || ''}
                onChange={e => setFilters({ ...filters, diameterMax: e.target.value ? Number(e.target.value) : undefined })}
                size="small"
                sx={{ width: 80 }}
              />
              <Select
                value={filters.diameterUnit || 'мм'}
                onChange={e => setFilters({ ...filters, diameterUnit: e.target.value })}
                size="small"
                sx={{ width: 80 }}
                label="Ед. изм."
              >
                <MenuItem value="мм">мм</MenuItem>
                <MenuItem value="дюйм">дюйм</MenuItem>
              </Select>
            </Box>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Тип соединения</InputLabel>
            <Select
              value={filters.connectionType || ''}
              onChange={(e) => setFilters({ ...filters, connectionType: e.target.value || undefined })}
              label="Тип соединения"
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

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Форма</InputLabel>
            <Select
              value={filters.shape || ''}
              onChange={e => setFilters({ ...filters, shape: e.target.value || undefined })}
              label="Форма"
            >
              <MenuItem value="">Любая</MenuItem>
              <MenuItem value="T">Тройник (T)</MenuItem>
              <MenuItem value="Y">Y-образный (Y)</MenuItem>
              <MenuItem value="L">Угол (L)</MenuItem>
              <MenuItem value="X">Крестовина (X)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Диаметры (через запятую, например: 16,16,20)"
            value={filters.diametersInput || ''}
            onChange={e => setFilters({ ...filters, diametersInput: e.target.value })}
            sx={{ minWidth: 220 }}
          />

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Группа</InputLabel>
            <Select
              value={filters.productgroup || ''}
              onChange={e => setFilters({ ...filters, productgroup: e.target.value, subgroup: '' })}
              label="Группа"
            >
              <MenuItem value="">Все группы</MenuItem>
              {allGroups.map(group => (
                <MenuItem key={group} value={group}>{group}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Подгруппа</InputLabel>
            <Select
              value={filters.subgroup || ''}
              onChange={e => setFilters({ ...filters, subgroup: e.target.value })}
              label="Подгруппа"
              disabled={!filters.productgroup}
            >
              <MenuItem value="">Все подгруппы</MenuItem>
              {(filters.productgroup ? allSubgroups(filters.productgroup) : []).map(subgroup => (
                <MenuItem key={subgroup} value={subgroup}>{subgroup}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={onReset} sx={{ height: 56 }}>Сбросить</Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Каталог товаров</Typography>
      <TextField
        fullWidth
        label="Быстрый поиск по названию, артикулу или адресу (фаззи)"
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
      {query ? (
        <Paper sx={{ mb: 3 }}>
          <List>
            {fuzzyResults.length === 0 && (
              <ListItem>
                <ListItemText primary="Ничего не найдено" />
              </ListItem>
            )}
            {fuzzyResults.map((result: FuseResult<any>) => (
              <ListItem key={result.item.SKU || result.item.sku}>
                <ListItemText
                  primary={result.item.NAMEIN_HEBREW || result.item.name}
                  secondary={`SKU: ${result.item.SKU || result.item.sku} | Адрес: ${result.item.ADRESS_IN_WAREHOUSE || result.item.location}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : null}
      {!query && (
        <>
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
            {filteredProducts.map((product, idx) => (
              <Box key={product.id || product.sku || idx}>
                <ProductCard
                  product={product}
                  onShowDetails={() => {}}
                  onShowLocation={() => {}}
                  onAddToOrder={() => {}}
                />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProductCatalog;
