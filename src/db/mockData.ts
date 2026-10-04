import { db } from './schema';
import type { ClientRecord, AppointmentRecord, ServiceLogRecord } from '../types';

export const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 'client-maya-lin',
    name: 'Maya Lin',
    phone: '+1 (415) 890-2341',
    instagram: '@mayalin.design',
    allergies: {
      hema: true,
      acrylates: true,
      acetone: false,
      notes: 'Severe contact dermatitis flare with standard HEMA base. Only use Light Elegance HEMA-free or Kokoist Platinum Bond Duo.',
    },
    sizing: {
      system: 'Gel-X',
      leftHand: { thumb: 0, index: 4, middle: 3, ring: 5, pinky: 8 },
      rightHand: { thumb: 0, index: 4, middle: 3, ring: 4, pinky: 8 },
    },
    preferredShape: 'Almond',
    preferredLength: 'Medium',
    notes: 'Likes high apex structure. Cuticles are delicate, e-file flame bit at low speed (max 5k RPM).',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'client-elena-rostova',
    name: 'Elena Rostova',
    phone: '+1 (510) 642-9901',
    instagram: '@elena_rostova',
    allergies: {
      hema: false,
      acrylates: false,
      acetone: false,
      notes: 'No known allergies or chemical sensitivities.',
    },
    sizing: {
      system: 'Gel-X',
      leftHand: { thumb: 1, index: 5, middle: 4, ring: 5, pinky: 9 },
      rightHand: { thumb: 1, index: 5, middle: 4, ring: 5, pinky: 9 },
    },
    preferredShape: 'Coffin',
    preferredLength: 'Long',
    notes: 'Loves chrome accents and velvet cat-eye magnets. Very punctual.',
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    id: 'client-chloe-vance',
    name: 'Chloe Vance',
    phone: '+1 (650) 332-1188',
    instagram: '@chloeevance',
    allergies: {
      hema: false,
      acrylates: false,
      acetone: true,
      notes: 'Dehydrates rapidly with acetone soaks; prefers gentle peel base or 100% e-file debulk removal.',
    },
    sizing: {
      system: 'Gel-X',
      leftHand: { thumb: 2, index: 6, middle: 5, ring: 6, pinky: 9 },
      rightHand: { thumb: 2, index: 5, middle: 5, ring: 6, pinky: 9 },
    },
    preferredShape: 'Square',
    preferredLength: 'Short',
    notes: 'Editorial minimalist styling. Loves sheer milky white and micro-french.',
    createdAt: Date.now() - 86400000 * 60,
  }
];

export function getInitialAppointments(): AppointmentRecord[] {
  const now = Date.now();
  return [
    {
      id: 'apt-maya-active',
      clientId: 'client-maya-lin',
      clientName: 'Maya Lin',
      scheduledTime: now - 1000 * 60 * 25, // Started 25 mins ago
      status: 'in_chair',
      baseService: 'Structured BIAB',
      artTier: 2,
      quotedPrice: 95,
      durationMinutes: 90,
      depositPaid: 30,
      notes: 'HEMA-Free BIAB rebalance + Chrome glazed finish',
    },
    {
      id: 'apt-elena-scheduled',
      clientId: 'client-elena-rostova',
      clientName: 'Elena Rostova',
      scheduledTime: now + 1000 * 60 * 120, // 2 hours later
      status: 'scheduled',
      baseService: 'Hard Gel Extensions',
      artTier: 3,
      quotedPrice: 135,
      durationMinutes: 120,
      depositPaid: 40,
      notes: 'Full set long coffin, 3D chrome drop accents',
    },
    {
      id: 'apt-chloe-scheduled',
      clientId: 'client-chloe-vance',
      clientName: 'Chloe Vance',
      scheduledTime: now + 1000 * 60 * 270, // 4.5 hours later
      status: 'scheduled',
      baseService: 'Natural Manicure',
      artTier: 1,
      quotedPrice: 60,
      durationMinutes: 60,
      depositPaid: 20,
      notes: 'Gentle dry Russian prep + sheer micro dots',
    }
  ];
}

export const INITIAL_SERVICE_LOGS: ServiceLogRecord[] = [
  {
    id: 'log-prev-maya-1',
    appointmentId: 'apt-prev-001',
    clientId: 'client-maya-lin',
    clientName: 'Maya Lin',
    timestamp: Date.now() - 86400000 * 21,
    baseService: 'Structured BIAB',
    formula: {
      baseBrand: 'Light Elegance Tack + JimmyGel (HEMA-Free)',
      shadeCodes: ['LE #402 Cashmere Kiss', 'Akzentz Bling On Silver'],
      topCoat: 'Glossy',
      details: 'Full cure 60s LED. Double coat sheer nude, subtle silver line art on ring fingers.',
    },
    finalBilled: 90,
    tip: 25,
  },
  {
    id: 'log-prev-elena-1',
    appointmentId: 'apt-prev-002',
    clientId: 'client-elena-rostova',
    clientName: 'Elena Rostova',
    timestamp: Date.now() - 86400000 * 10,
    baseService: 'Gel-X Extensions',
    formula: {
      baseBrand: 'Apres Gel-X Medium Coffin',
      shadeCodes: ['DND #445 Black Licorice', 'Daily Charme Mirror Chrome Aurora'],
      topCoat: 'Chrome Gel',
      details: 'Non-wipe chrome gel base 30s flash cure, burnished with silicone tool, sealed with hard gel top.',
    },
    finalBilled: 125,
    tip: 30,
  }
];

export async function seedDatabaseIfEmpty(): Promise<boolean> {
  try {
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
