export type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export type SizingHand = Record<FingerName, number>;

export type SizingSystem = 'Gel-X' | 'Paper-Forms' | 'Press-On' | 'Custom';

export interface SizingProfile {
  system: SizingSystem;
  leftHand: SizingHand;
  rightHand: SizingHand;
}

export interface ClientAllergies {
  hema: boolean;
  acrylates: boolean;
  acetone: boolean;
  notes?: string;
}

export type NailShape = 'Square' | 'Squoval' | 'Almond' | 'Coffin' | 'Stiletto' | 'Duck';
export type NailLength = 'Natural' | 'Short' | 'Medium' | 'Long' | 'XL';

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  instagram?: string;
  allergies: ClientAllergies;
  sizing: SizingProfile;
  preferredShape: NailShape;
  preferredLength: NailLength;
  notes?: string;
  createdAt: number;
}

export type AppointmentStatus = 'scheduled' | 'in_chair' | 'completed' | 'cancelled';

export interface AppointmentRecord {
  id: string;
  clientId: string;
  clientName: string;
  scheduledTime: number; // Unix ms
  status: AppointmentStatus;
  baseService: string;
  artTier: number;
  quotedPrice: number;
  durationMinutes: number;
  depositPaid: number;
  notes?: string;
}

export interface ServiceFormula {
  baseBrand: string;
  shadeCodes: string[];
  topCoat: 'Glossy' | 'Matte' | 'Chrome Gel';
  details?: string;
}

export interface ServiceLogRecord {
  id: string;
  appointmentId: string;
  clientId: string;
  clientName?: string;
  timestamp: number;
  baseService: string;
  formula: ServiceFormula;
  inspoPhotoBlob?: Blob;
  resultPhotoBlob?: Blob;
  finalBilled: number;
  tip: number;
}

export interface ArtTierDefinition {
  tier: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  examples: string[];
}

export interface BaseServiceOption {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: 'natural' | 'overlay' | 'extensions';
  description: string;
}
