import { db } from './schema';
import type { ServiceItem } from '../types';


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

export async function seedDatabaseIfEmpty(): Promise<boolean> {
  try {
    // 1. Seed official 23-service catalog if not already populated
    const serviceCount = await db.services.count();
    if (serviceCount === 0) {
      await db.services.bulkAdd(INITIAL_SERVICES);
    }

    // 2. Production cleanup: remove any dev sample data left in browser IndexedDB
    await Promise.all([
      db.clients.where('id').anyOf(['client-millie-1', 'client-sophia-2']).delete().catch(() => {}),
      db.appointments.where('id').anyOf(['apt-millie-active', 'apt-prev-001']).delete().catch(() => {}),
      db.serviceLogs.where('id').anyOf(['log-prev-1']).delete().catch(() => {}),
    ]);

    return true;
  } catch (err) {
    console.error('Failed to initialize database catalog:', err);
    return false;
  }
}

