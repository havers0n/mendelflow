import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import itemsRouter from './routes/items';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemsRouter);

// Basic routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to MendelFlow API',
    endpoints: {
      items: '/api/items',
      search: '/api/items/search/:query',
      docs: '/api-docs'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'MendelFlow API',
    database: 'Supabase',
    supabaseUrl: process.env.SUPABASE_URL ? 'Configured' : 'Missing'
  });
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📦 Items API: http://localhost:${PORT}/api/items`);
  console.log(`🔑 Supabase URL: ${process.env.SUPABASE_URL ? 'Configured' : 'Missing'}`);
}); 