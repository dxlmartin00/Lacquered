import { db } from './schema';
import type { ClientRecord, AppointmentRecord, ServiceLogRecord, ServiceItem } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  // SOFT GEL SERVICES
  {
    id: 'srv-soft-1',
    category: 'soft_gel',
    categoryLabel: 'Soft Gel Services',
    name: 'Gel Polish',
    price: 300,
  },
  {
    id: 'srv-soft-2',
    category: 'soft_gel',
    categoryLabel: 'Soft Gel Services',
    name: 'Softgel Extension (Plain)',
    price: 600,
  },
  {
    id: 'srv-soft-3',
    category: 'soft_gel',
    categoryLabel: 'Soft Gel Services',
    name: 'Gel Polish Removal',
    price: 100,
  },
  {
    id: 'srv-soft-4',
    category: 'soft_gel',
    categoryLabel: 'Soft Gel Services',
    name: 'Softgel Extension Removal',
    price: 200,
  },

  // HARD GEL SERVICES
  {
    id: 'srv-hard-1',
    category: 'hard_gel',
    categoryLabel: 'Hard Gel Services',
    name: 'Hard Gel Overlay (Plain)',
    price: 700,
  },
  {
    id: 'srv-hard-2',
    category: 'hard_gel',
    categoryLabel: 'Hard Gel Services',
    name: 'Hard Gel Extensions (Plain) - Short',
    price: 900,
  },
  {
    id: 'srv-hard-3',
    category: 'hard_gel',
    categoryLabel: 'Hard Gel Services',
    name: 'Hard Gel Extensions (Plain) - Medium',
    price: 1100,
  },
  {
    id: 'srv-hard-4',
    category: 'hard_gel',
    categoryLabel: 'Hard Gel Services',
    name: 'Hard Gel Extensions (Plain) - Long',
    price: 1300,
  },
  {
    id: 'srv-hard-5',
    category: 'hard_gel',
    categoryLabel: 'Hard Gel Services',
    name: 'Hard Gel Extensions (Plain) - XL',
    price: 1500,
  },
  {
    id: 'srv-hard-6',
    category: 'hard_gel',
    categoryLabel: 'Hard Gel Services',
    name: 'Hard Gel Refill (within 3–4 weeks)',
    price: 550,
  },

  // ADD ONS PER NAIL
  {
    id: 'srv-addon-1',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'French Tip',
    price: 25,
    perNail: true,
  },
  {
    id: 'srv-addon-2',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Marble',
    price: 25,
    perNail: true,
  },
  {
    id: 'srv-addon-3',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Reflective Glitter',
    price: 20,
    perNail: true,
  },
  {
    id: 'srv-addon-4',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Cat Eye',
    price: 25,
    perNail: true,
  },
  {
    id: 'srv-addon-5',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Chrome',
    price: 20,
    perNail: true,
  },
  {
    id: 'srv-addon-6',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Ombre',
    price: 30,
    perNail: true,
  },
  {
    id: 'srv-addon-7',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Blooming Art',
    price: 25,
    perNail: true,
  },
  {
    id: 'srv-addon-8',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Hand Painted',
    price: 15,
    perNail: true,
  },
  {
    id: 'srv-addon-9',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: '3D Mermaids',
    price: 20,
    perNail: true,
  },
  {
    id: 'srv-addon-10',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: '3D Flowers (or similar)',
    price: 50,
    perNail: true,
  },
  {
    id: 'srv-addon-11',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Rhinestones/Beads',
    price: 10,
    perNail: true,
  },
  {
    id: 'srv-addon-12',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Nail Charms',
    price: 25,
    perNail: true,
  },
  {
    id: 'srv-addon-13',
    category: 'add_on',
    categoryLabel: 'Add Ons Per Nail',
    name: 'Foil',
    price: 25,
    perNail: true,
  },
];

export const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 'client-millie-1',
    name: 'Millie Chen',
    phone: '+63 917 892 4431',
    instagram: '@millie.glow',
    allergies: {
      hema: false,
      acrylates: false,
      acetone: false,
    },
    sizing: {
      system: 'Gel-X',
      leftHand: { thumb: 0, index: 4, middle: 3, ring: 4, pinky: 7 },
      rightHand: { thumb: 0, index: 4, middle: 3, ring: 4, pinky: 7 },
    },
    preferredShape: 'Almond',
    preferredLength: 'Medium',
    notes: 'Loves soft pink almond sets with chrome finish.',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'client-sophia-2',
    name: 'Sophia Nicole',
    phone: '+63 920 551 8832',
    instagram: '@sophiancl',
    allergies: {
      hema: true,
      acrylates: false,
      acetone: false,
      notes: 'Sensitive cuticles, use gentle prep.',
    },
    sizing: {
      system: 'Gel-X',
      leftHand: { thumb: 1, index: 5, middle: 4, ring: 5, pinky: 8 },
      rightHand: { thumb: 1, index: 5, middle: 4, ring: 5, pinky: 8 },
    },
    preferredShape: 'Square',
    preferredLength: 'Short',
    notes: 'Prefers 3D flower charms on ring fingers.',
    createdAt: Date.now() - 86400000 * 2,
  },
];

export function getInitialAppointments(): AppointmentRecord[] {
  const now = Date.now();
  return [
    {
      id: 'apt-millie-active',
      clientId: 'client-millie-1',
      clientName: 'Millie Chen',
      clientPhone: '+63 917 892 4431',
      scheduledTime: now - 1000 * 60 * 15,
      status: 'in_chair',
      baseService: 'Softgel Extension (Plain)',
      artTier: 2,
      quotedPrice: 850,
      depositPaid: 0,
      selectedServices: [
        { serviceId: 'srv-soft-2', name: 'Softgel Extension (Plain)', price: 600, quantity: 1 },
        { serviceId: 'srv-addon-5', name: 'Chrome', price: 20, quantity: 10, perNail: true },
        { serviceId: 'srv-addon-12', name: 'Nail Charms', price: 25, quantity: 2, perNail: true },
      ],
      totalPrice: 850,
      durationMinutes: 75,
      notes: 'Pink chrome glazed almond set with 2 bows',
      createdAt: now - 1000 * 60 * 20,
    },
  ];
}

export const INITIAL_SERVICE_LOGS: ServiceLogRecord[] = [
  {
    id: 'log-prev-1',
    appointmentId: 'apt-prev-001',
    clientId: 'client-sophia-2',
    clientName: 'Sophia Nicole',
    timestamp: Date.now() - 86400000 * 3,
    baseService: 'Hard Gel Extensions (Plain) - Short',
    formula: {
      baseBrand: 'Pretty Tips Studio',
      shadeCodes: ['Milky Pink #04', 'Cloud White #01'],
      topCoat: 'Glossy',
      details: 'Gentle cuticle care, dual cure LED 60s',
    },
    selectedServices: [
      { serviceId: 'srv-hard-2', name: 'Hard Gel Extensions (Plain) - Short', price: 900, quantity: 1 },
      { serviceId: 'srv-addon-1', name: 'French Tip', price: 25, quantity: 10, perNail: true },
      { serviceId: 'srv-addon-10', name: '3D Flowers', price: 50, quantity: 2, perNail: true },
    ],
    finalBilled: 1250,
    tip: 150,
    notes: 'Full short square set, pastel French tips + 3D blooms',
  },
];

export async function seedDatabaseIfEmpty(): Promise<boolean> {
  try {
    const serviceCount = await db.services.count();
    if (serviceCount === 0) {
      await db.services.bulkAdd(INITIAL_SERVICES);
    }

    const clientCount = await db.clients.count();
    if (clientCount === 0) {
      await db.clients.bulkAdd(INITIAL_CLIENTS);
      await db.appointments.bulkAdd(getInitialAppointments());
      await db.serviceLogs.bulkAdd(INITIAL_SERVICE_LOGS);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to seed database:', err);
    return false;
  }
}
