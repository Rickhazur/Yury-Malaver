
import { Client, Reservation } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Carolina Herrera',
    phone: '+57 300 123 4567',
    email: 'caro.h@example.com',
    dob: '1985-04-12',
    type: 'VIP',
    registration_date: '2023-01-15',
    total_spent: 1250000,
    points: 450,
    preferences: {
      hair_type: 'Ondulado, Fino',
      color_prefs: ['Rubio Cenizo', 'Miel'],
      products_used: ['Olaplex No. 3', 'Kérastase Nutritive'],
      allergies: 'Ninguna',
      notes: 'Prefiere el café con leche de almendras. Cita siempre con Andrea.'
    },
    history: [
      {
        id: 'h1',
        client_id: 'c1',
        date: '2023-10-05',
        service: 'Balayage Premium',
        stylist: 'Andrea',
        price: 450000,
        payment_method: 'Tarjeta'
      },
      {
        id: 'h2',
        client_id: 'c1',
        date: '2023-08-12',
        service: 'Manicura Rusa',
        stylist: 'Sofia',
        price: 80000,
        payment_method: 'Efectivo'
      }
    ]
  },
  {
    id: 'c2',
    name: 'Valentina Ramirez',
    phone: '+57 310 987 6543',
    email: 'valen.r@example.com',
    dob: '1992-08-30',
    type: 'Frecuente',
    registration_date: '2023-05-20',
    total_spent: 680000,
    points: 210,
    preferences: {
      hair_type: 'Liso, Graso',
      color_prefs: ['Chocolate', 'Negro Azabache'],
      products_used: ['Shampoo Detox', 'Mascarilla Hidratante'],
      allergies: 'Látex',
      notes: 'Sensible al calor del secador.'
    },
    history: [
      {
        id: 'h3',
        client_id: 'c2',
        date: '2023-10-20',
        service: 'Corte & Diseño',
        stylist: 'Carlos',
        price: 90000,
        payment_method: 'Transferencia'
      },
      {
        id: 'h4',
        client_id: 'c2',
        date: '2023-09-15',
        service: 'Pedicura Spa',
        stylist: 'Sofia',
        price: 70000,
        payment_method: 'Efectivo'
      }
    ]
  },
  {
    id: 'c3',
    name: 'Isabella Montoya',
    phone: '+57 315 555 1234',
    email: 'isa.m@example.com',
    dob: '1998-12-10',
    type: 'Nuevo',
    registration_date: '2023-10-01',
    total_spent: 120000,
    points: 50,
    preferences: {
      hair_type: 'Rizado, Seco',
      color_prefs: ['Natural'],
      products_used: ['Curly Method Kit'],
      allergies: 'Ninguna',
      notes: 'Primera visita, interesada en tratamiento de keratina.'
    },
    history: [
      {
        id: 'h5',
        client_id: 'c3',
        date: '2023-10-01',
        service: 'Tratamiento Capilar',
        stylist: 'Andrea',
        price: 120000,
        payment_method: 'Tarjeta'
      }
    ]
  }
];

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'r1',
    client_name: 'Maria Fernanda',
    phone: '3001234567',
    service: 'Balayage Premium',
    date: '2023-10-25',
    time: '10:00',
    status: 'confirmed'
  },
  {
    id: 'r2',
    client_name: 'Laura Gomez',
    phone: '3109876543',
    service: 'Manicura Rusa',
    date: '2023-10-25',
    time: '14:30',
    status: 'pending'
  },
  {
    id: 'r3',
    client_name: 'Camila Torres',
    phone: '3155551122',
    service: 'Corte & Diseño Capilar',
    date: '2023-10-26',
    time: '09:00',
    status: 'confirmed'
  }
];

export const MOCK_STATS = {
  topServices: [
    { name: 'Balayage', count: 45 },
    { name: 'Manicura Rusa', count: 38 },
    { name: 'Corte', count: 30 },
    { name: 'Pedicura', count: 25 },
    { name: 'Maquillaje', count: 12 },
  ],
  paymentMethods: [
    { name: 'Tarjeta', value: 45, color: '#D4AF37' }, // Gold
    { name: 'Nequi', value: 30, color: '#6320EE' }, // Nequi Purple
    { name: 'Transferencia', value: 15, color: '#FB7185' }, // Rose
    { name: 'Efectivo', value: 10, color: '#E5E7EB' }, // Grey
  ],
  monthlyVisits: [
    { month: 'Jul', visits: 120 },
    { month: 'Ago', visits: 145 },
    { month: 'Sep', visits: 160 },
    { month: 'Oct', visits: 135 },
  ],
  busyDays: [
    { day: 'Lun', count: 15 },
    { day: 'Mar', count: 20 },
    { day: 'Mié', count: 35 },
    { day: 'Jue', count: 50 },
    { day: 'Vie', count: 85 }, // High
    { day: 'Sáb', count: 95 }, // Peak
  ]
};