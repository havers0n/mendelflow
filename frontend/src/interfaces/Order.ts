export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  invoiceNumber?: string;
  customerName: string;
  customerContact?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  tasks: string[]; // ID задач, связанных с заказом
  progress?: number;
  assignedTo?: string; // ID кладовщика
}

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  quantityCollected: number;
  location: string; // Формат: XX.XX.XX.XX
  status: OrderItemStatus;
  imageUrl?: string;
  description?: string;
  availableQuantity: number; // Количество в наличии
}

export enum OrderStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD'
}

export enum OrderItemStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface OrderFilter {
  status?: OrderStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  orderNumber?: string;
  invoiceNumber?: string;
  assignedTo?: string;
} 