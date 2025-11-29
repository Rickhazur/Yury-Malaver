
export interface StyleOption {
  id: string;
  name: string;
  category: 'hair' | 'makeup' | 'nails';
  description: string;
}

// Matches 'appointments' table
export interface Reservation {
  id: string;
  client_name: string; // Changed from clientName
  phone: string;
  email?: string; // Added email field
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string; // Changed from createdAt number
}

export type VisionAnalysis = {
  faceShape: string;
  skinTone: string;
  suggestedHair: string;
  suggestedMakeup: string;
  suggestedNails: string;
  reasoning: string;
};

// CRM Types
export type ClientType = 'Nuevo' | 'Frecuente' | 'VIP' | 'Inactivo';

// Matches 'service_history' table
export interface ServiceRecord {
  id: string;
  client_id: string;
  date: string;
  service: string;
  stylist: string;
  price: number;
  payment_method: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Nequi';
}

// Matches 'client_preferences' table
export interface ClientPreferences {
  client_id?: string;
  hair_type: string;
  color_prefs: string[];
  products_used: string[];
  allergies: string;
  notes: string;
}

// Matches 'clients' table joined with others
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  type: ClientType;
  registration_date: string;
  total_spent: number;
  points: number;
  
  // Joined data
  history?: ServiceRecord[];
  preferences?: ClientPreferences;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_code?: string;
  valid_until?: string;
  image?: string; // URL or Base64
  target_audience?: 'ALL' | 'VIP';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  min_stock: number;
  price: number;
  last_restock?: string;
}

export interface GeneratedContent {
  id: string;
  type: 'text' | 'image';
  content: string; // Text body or Base64 image
  prompt: string;
  created_at: string;
}
