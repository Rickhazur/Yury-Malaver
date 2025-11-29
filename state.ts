
import { Reservation, Client, ClientType, Promotion } from './types';

// This state manager now uses LocalStorage to persist data across page reloads

type Listener = () => void;

const STORAGE_KEYS = {
  RESERVATIONS: 'ym_reservations',
  CLIENTS: 'ym_clients',
  PROMOTIONS: 'ym_promotions'
};

class Store {
  // Initialize as empty arrays. No more Mock Data.
  private reservations: Reservation[] = [];
  private clients: Client[] = [];
  private promotions: Promotion[] = [
    {
        id: 'p1',
        title: 'Bienvenida de Lujo',
        description: '20% de descuento en tu primer Balayage o Diseño de Color.',
        discount_code: 'NEWGLOW20'
    }
  ];
  private listeners: Listener[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return;

        // Load Reservations
        const savedRes = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
        if (savedRes) {
            try {
                this.reservations = JSON.parse(savedRes);
            } catch (e) {
                console.error("Error parsing reservations from storage", e);
            }
        }

        // Load Clients
        const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
        if (savedClients) {
            try {
                this.clients = JSON.parse(savedClients);
            } catch (e) {
                console.error("Error parsing clients from storage", e);
            }
        }

        // Load Promotions
        const savedPromos = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
        if (savedPromos) {
            try {
                this.promotions = JSON.parse(savedPromos);
            } catch (e) {
                console.error("Error parsing promotions from storage", e);
            }
        }

    } catch (e) {
        console.warn("LocalStorage access denied or failed.", e);
    }
  }

  private saveToStorage() {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(this.reservations));
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(this.clients));
        localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(this.promotions));
    } catch (e) {
        console.warn("LocalStorage save failed", e);
    }
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage(); // Auto-save on every change
    this.listeners.forEach(l => l());
  }

  getReservations() {
    return this.reservations;
  }

  getClients() {
    return this.clients;
  }

  getPromotions() {
    return this.promotions;
  }

  addReservation(reservation: Reservation) {
    this.reservations = [reservation, ...this.reservations];
    
    // Check if client exists, if not, add a client profile for them
    const existingClient = this.clients.find(c => c.name === reservation.client_name);
    if (!existingClient) {
      const newClient: Client = {
        id: `c_${Date.now()}`,
        name: reservation.client_name,
        phone: reservation.phone,
        email: 'cliente@ejemplo.com',
        dob: '1990-01-01',
        type: 'Nuevo',
        registration_date: new Date().toISOString().split('T')[0],
        total_spent: 0,
        points: 0,
        history: [],
        preferences: {
            hair_type: 'Por definir',
            color_prefs: [],
            products_used: [],
            allergies: '',
            notes: 'Cliente registrado desde la web.'
        }
      };
      this.clients = [newClient, ...this.clients];
    }
    this.notify();
  }

  updateReservationStatus(id: string, status: Reservation['status']) {
    this.reservations = this.reservations.map(r => 
      r.id === id ? { ...r, status } : r
    );
    this.notify();
  }

  updateClientStatus(clientId: string, newType: ClientType) {
    this.clients = this.clients.map(c => 
      c.id === clientId ? { ...c, type: newType } : c
    );
    this.notify();
  }

  addPromotion(promo: Promotion) {
    this.promotions = [promo, ...this.promotions];
    this.notify();
  }

  deletePromotion(id: string) {
    this.promotions = this.promotions.filter(p => p.id !== id);
    this.notify();
  }
}

export const localStore = new Store();
