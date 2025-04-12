import { createClient, PostgrestError } from '@supabase/supabase-js';
import { Task as ITask, TaskStatus, TaskPriority } from '../interfaces/Task';
import { Order as IOrder, OrderStatus } from '../interfaces/Order';
import { mockUsers } from '../mocks/user';

// Supabase connection configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Error handling helper
const handleSupabaseError = (error: unknown): never => {
  if (error instanceof Error) {
    throw error;
  }
  if (typeof error === 'object' && error !== null) {
    const postgrestError = error as PostgrestError;
    if (postgrestError.message) {
      console.error('Supabase error details:', {
        message: postgrestError.message,
        details: postgrestError.details,
        hint: postgrestError.hint,
        code: postgrestError.code
      });
      throw new Error(postgrestError.message);
    }
  }
  throw new Error('An unknown error occurred');
};

// Database interfaces
export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdAt: Date;
  dueDate: Date;
  orderNumber: string;
  location: string;
  items?: {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    quantityCollected: number;
    location: string;
  }[];
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  invoice_number: string;
  customer_name: string;
  customer_contact: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  department?: string;
  position?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Database helper functions
export const db = {
  // Tasks
  async getTasks() {
    try {
      console.log('Fetching tasks...');
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return handleSupabaseError(error);
      }
      
      if (!data) return [];
      
      console.log('Tasks fetched successfully:', data.length);
      return data.map((task: any) => ({
        id: task.id.toString(),
        title: task.title,
        description: task.description || '',
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        assignedTo: task.assigned_to || '',
        createdAt: new Date(task.created_at),
        dueDate: task.due_date ? new Date(task.due_date) : new Date(),
        orderNumber: task.order_number || '',
        location: task.location || '',
        items: task.items || []
      }));
    } catch (error) {
      console.error('Unexpected error in getTasks:', error);
      throw error;
    }
  },

  async createTask(task: Omit<ITask, 'id' | 'createdAt'>) {
    try {
      console.log('Creating task:', task);
      const taskData = {
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assigned_to: task.assignedTo ? parseInt(task.assignedTo, 10) || null : null,
        due_date: task.dueDate?.toISOString(),
        order_number: task.orderNumber || '',
        location: task.location || '',
        items: task.items || []
      };

      console.log('Task data to insert:', taskData);
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating task:', error);
        return handleSupabaseError(error);
      }
      
      if (!data) {
        throw new Error('No data returned from database after creating task');
      }
      
      console.log('Task created successfully:', data);
      return {
        id: data.id.toString(),
        title: data.title,
        description: data.description || '',
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        assignedTo: data.assigned_to ? data.assigned_to.toString() : '',
        createdAt: new Date(data.created_at),
        dueDate: data.due_date ? new Date(data.due_date) : new Date(),
        orderNumber: data.order_number || '',
        location: data.location || '',
        items: data.items || []
      };
    } catch (error) {
      console.error('Unexpected error in createTask:', error);
      throw error;
    }
  },

  async updateTask(id: string, updates: Partial<ITask>) {
    try {
      console.log('Updating task:', { id, updates });
      const taskData = {
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.status && { status: updates.status }),
        ...(updates.priority && { priority: updates.priority }),
        ...(updates.assignedTo !== undefined && { 
          assigned_to: updates.assignedTo ? parseInt(updates.assignedTo, 10) || null : null 
        }),
        ...(updates.dueDate && { due_date: updates.dueDate.toISOString() }),
        ...(updates.orderNumber !== undefined && { order_number: updates.orderNumber }),
        ...(updates.location !== undefined && { location: updates.location }),
        ...(updates.items && { items: updates.items })
      };

      console.log('Task data to update:', taskData);
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating task:', error);
        return handleSupabaseError(error);
      }
      
      if (!data) {
        throw new Error('No data returned from database after updating task');
      }
      
      console.log('Task updated successfully:', data);
      return {
        id: data.id.toString(),
        title: data.title,
        description: data.description || '',
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        assignedTo: data.assigned_to ? data.assigned_to.toString() : '',
        createdAt: new Date(data.created_at),
        dueDate: data.due_date ? new Date(data.due_date) : new Date(),
        orderNumber: data.order_number || '',
        location: data.location || '',
        items: data.items || []
      };
    } catch (error) {
      console.error('Unexpected error in updateTask:', error);
      throw error;
    }
  },

  async deleteTask(id: string) {
    try {
      console.log('Deleting task:', id);
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting task:', error);
        return handleSupabaseError(error);
      }
      
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Unexpected error in deleteTask:', error);
      throw error;
    }
  },

  // Orders
  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Users
  async getUsers() {
    try {
      console.log('Fetching users...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users from database, using mock data:', error);
        return mockUsers;
      }
      
      if (!data || data.length === 0) {
        console.log('No users found in database, using mock data');
        return mockUsers;
      }
      
      console.log('Users fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Unexpected error in getUsers, using mock data:', error);
      return mockUsers;
    }
  },

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateUser(id: number, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteUser(id: number) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}; 