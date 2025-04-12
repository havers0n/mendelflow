import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Get all items
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error fetching items',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get single item by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error fetching item',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new item
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, sku, quantity, location } = req.body;
    
    // Validate required fields
    if (!name || !sku) {
      return res.status(400).json({ error: 'Name and SKU are required' });
    }

    const { data, error } = await supabase
      .from('items')
      .insert([{ name, sku, quantity, location }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error creating item',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, sku, quantity, location } = req.body;

    const { data, error } = await supabase
      .from('items')
      .update({ name, sku, quantity, location, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error updating item',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ 
      error: 'Error deleting item',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search items
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .or(`name.ilike.%${query}%,sku.ilike.%${query}%,location.ilike.%${query}%`);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error searching items',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 