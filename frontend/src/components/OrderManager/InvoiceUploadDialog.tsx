import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  Upload as UploadIcon,
  ContentPaste as PasteIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { OrderItem, OrderItemStatus } from '../../interfaces/Order';

interface InvoiceUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onProcess: (items: OrderItem[]) => void;
}

const InvoiceUploadDialog: React.FC<InvoiceUploadDialogProps> = ({
  open,
  onClose,
  onProcess,
}) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewItems, setPreviewItems] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setText(text);
        processText(text);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      processText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setError('Не удалось прочитать буфер обмена');
    }
  };

  const processText = (inputText: string) => {
    setError(null);
    const lines = inputText.split('\n');
    const items: OrderItem[] = [];
    
    // Пропускаем заголовки и пустые строки
    const dataLines = lines.filter(line => {
      const trimmedLine = line.trim();
      return trimmedLine && 
             !trimmedLine.includes('Название товара') &&
             !trimmedLine.includes('Артикул') &&
             !trimmedLine.includes('В наличии') &&
             !trimmedLine.includes('Необходимо') &&
             trimmedLine !== '=';
    });

    // Группируем строки по 4 (название, артикул, в наличии, необходимо)
    for (let i = 0; i < dataLines.length; i += 4) {
      if (i + 3 >= dataLines.length) break;

      const name = dataLines[i].trim();
      const sku = dataLines[i + 1].trim();
      const availableQuantity = parseInt(dataLines[i + 2].trim());
      const quantity = parseInt(dataLines[i + 3].trim());

      if (!/^[A-Za-z]{2}\d+$/.test(sku)) {
        setError(`Строка ${i + 2}: Неверный формат артикула`);
        return;
      }

      if (isNaN(availableQuantity) || isNaN(quantity)) {
        setError(`Строка ${i + 3}: Неверный формат количества`);
        return;
      }

      items.push({
        id: (i / 4 + 1).toString(),
        sku,
        name,
        quantity,
        quantityCollected: 0,
        location: '', // Пока не используем местоположение
        status: OrderItemStatus.PENDING,
        availableQuantity,
      });
    }

    setPreviewItems(items);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    processText(newText);
  };

  const handleProcess = () => {
    if (previewItems.length === 0) {
      setError('Нет данных для обработки');
      return;
    }
    onProcess(previewItems);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={window.innerWidth < 600}
      PaperProps={{
        sx: {
          m: { xs: 0, sm: 2 },
          height: { xs: '100%', sm: 'auto' },
        }
      }}
    >
      <DialogTitle sx={{ p: { xs: 1, sm: 2 } }}>Загрузка накладной</DialogTitle>
      <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          gap: 2
        }}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 1, sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Загрузите файл накладной или вставьте текст
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              sx={{ width: '100%' }}
            >
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                fullWidth
                size="small"
              >
                Загрузить файл
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept=".txt,.html,.pdf"
              />
              
              <Button
                variant="outlined"
                startIcon={<PasteIcon />}
                onClick={handlePaste}
                fullWidth
                size="small"
              >
                Вставить из буфера
              </Button>
            </Stack>
          </Paper>

          <TextField
            multiline
            rows={window.innerWidth < 600 ? 4 : 10}
            fullWidth
            value={text}
            onChange={handleTextChange}
            placeholder="Вставьте текст накладной или загрузите файл"
            size="small"
            InputProps={{
              endAdornment: text && (
                <IconButton
                  onClick={() => {
                    setText('');
                    setPreviewItems([]);
                    setError(null);
                  }}
                  edge="end"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          {previewItems.length > 0 && (
            <Paper variant="outlined" sx={{ overflowX: 'auto', flex: 1 }}>
              <Typography variant="subtitle2" sx={{ p: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Предварительный просмотр ({previewItems.length} позиций):
              </Typography>
              <TableContainer>
                <Table size="small" sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Артикул</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Название</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Количество</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Местоположение</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{item.sku}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{item.name}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{item.quantity}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{item.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Подсказка по формату:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
              Система ожидает текст в формате:<br />
              Название товара<br />
              Артикул<br />
              В наличии<br />
              Необходимо<br />
              <br />
              Например:<br />
              Ноутбук Lenovo<br />
              NB12345<br />
              10<br />
              15
            </Typography>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Button onClick={onClose} size="small">Отмена</Button>
        <Button
          onClick={handleProcess}
          variant="contained"
          disabled={previewItems.length === 0 || isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} /> : null}
          size="small"
        >
          {isProcessing ? 'Обработка...' : 'Обработать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceUploadDialog; 