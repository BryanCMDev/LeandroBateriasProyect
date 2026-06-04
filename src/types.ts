/**
 * Leandro Baterías Types & Interfaces
 */

export interface Product {
  id: string;
  title: string;
  sku: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  amperage?: string; // e.g. "40Ah", "50Ah", "70Ah"
  voltage: string;   // e.g. "12V"
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ReceiptType = 'boleta' | 'factura' | 'ticket';

export type PaymentMethod = 'yape' | 'plin' | 'tarjeta';

export interface BillingInfo {
  receiptType: ReceiptType;
  ruc?: string;
  razonSocial?: string;
  fullName: string;
  documentId: string;
  email: string;
  phoneNumber: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  documentId: string;
  receiptType: ReceiptType;
  email: string;
  phoneNumber: string;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  total: number;
  status: 'Completado' | 'Pendiente' | 'Enviado';
}

export type ViewType = 'catalog' | 'checkout' | 'admin' | 'login';

export interface DbStatus {
  connected: boolean;
  mode: 'sql_server' | 'local_file';
  server?: string;
  database?: string;
  error?: string;
}

