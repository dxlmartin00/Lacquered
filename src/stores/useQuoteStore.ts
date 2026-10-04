import { create } from 'zustand';
import type { BaseServiceOption, ArtTierDefinition } from '../types';

export const BASE_SERVICES: BaseServiceOption[] = [
  {
    id: 'natural-mani',
    name: 'Natural Manicure',
    price: 45,
    duration: 45,
    category: 'natural',
    description: 'Dry Russian cuticle refinement, nail shaping, ridge-filling sheer polish.',
  },
  {
    id: 'structured-biab',
    name: 'Structured BIAB',
    price: 75,
    duration: 60,
    category: 'overlay',
    description: 'Builder in a bottle gel overlay creating natural apex reinforcement.',
  },
  {
    id: 'gel-x',
    name: 'Gel-X Extensions',
    price: 85,
    duration: 75,
    category: 'extensions',
    description: '100% soak-off soft gel full coverage tips with zero odor.',
  },
  {
    id: 'hard-gel',
    name: 'Hard Gel Full Set',
    price: 95,
    duration: 90,
    category: 'extensions',
    description: 'Sculpted hard gel on paper forms with high architectural durability.',
  },
  {
    id: 'acrylic-set',
    name: 'Acrylic Full Set',
    price: 90,
    duration: 90,
    category: 'extensions',
    description: 'Traditional liquid monomer & polymer powder sculpting system.',
  },
];

export const ART_TIERS: ArtTierDefinition[] = [
  {
    tier: 0,
    name: 'Tier 0: Solid Studio Color',
    price: 0,
    duration: 0,
    description: 'Single or two-tone high pigment gel polish. No artwork.',
    examples: ['High Gloss Cream', 'Solid Sheer Nude', 'Studio Matte Black'],
  },
  {
    tier: 1,
    name: 'Tier 1: Minimal Accents',
    price: 15,
    duration: 15,
    description: 'Subtle accent nails, delicate chrome dust, minimal foils or dots.',
    examples: ['Micro-Dots', 'Foil Flecks', 'Single Accent Nail per Hand'],
  },
  {
    tier: 2,
    name: 'Tier 2: Elevated Classics',
    price: 25,
    duration: 30,
    description: 'Modern French tips, glazed donut chrome, or magnetic velvet cat-eye.',
    examples: ['Glazed Chrome', 'Velvet Cat-Eye Magnet', 'Deep French Smile Lines'],
  },
  {
    tier: 3,
    name: 'Tier 3: Dimensional Craft',
    price: 40,
    duration: 45,
    description: '3D drop gel, botanical encapsulation, blooming water marble, or multi-chrome.',
    examples: ['3D Water Droplets', 'Dried Floral Encapsulation', 'Blooming Watercolor Gel'],
  },
  {
    tier: 4,
    name: 'Tier 4: Editorial & Murals',
    price: 65,
    duration: 60,
    description: 'Hand-painted character art, Japanese fine line lettering, textured chrome relief.',
    examples: ['Hand-Painted Anime/Mural', 'Chrome Cyber Metal Relief', '10-Finger Asymmetric Art'],
  },
];

export const NAIL_REPAIR_PRICE = 5;
export const NAIL_REPAIR_DURATION = 10;
export const FOREIGN_REMOVAL_PRICE = 25;
export const FOREIGN_REMOVAL_DURATION = 30;

interface QuoteStore {
  selectedBaseId: string;
  selectedTier: number;
  nailRepairsCount: number;
  hasForeignRemoval: boolean;
  depositAmount: number;

  // Actions
  setBaseService: (id: string) => void;
  setArtTier: (tier: number) => void;
  incrementRepairs: () => void;
  decrementRepairs: () => void;
  setRepairsCount: (count: number) => void;
  toggleForeignRemoval: () => void;
  setDepositAmount: (amt: number) => void;
  resetQuote: () => void;

  // Computed helper getters
  getTotalPrice: () => number;
  getTotalDuration: () => number;
  getSelectedBase: () => BaseServiceOption;
  getSelectedTierObj: () => ArtTierDefinition;
}

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  selectedBaseId: 'structured-biab',
  selectedTier: 1,
  nailRepairsCount: 0,
  hasForeignRemoval: false,
  depositAmount: 25,

  setBaseService: (id) => set({ selectedBaseId: id }),
  setArtTier: (tier) => set({ selectedTier: tier }),
  incrementRepairs: () => set((state) => ({ nailRepairsCount: Math.min(10, state.nailRepairsCount + 1) })),
  decrementRepairs: () => set((state) => ({ nailRepairsCount: Math.max(0, state.nailRepairsCount - 1) })),
  setRepairsCount: (count) => set({ nailRepairsCount: Math.max(0, Math.min(10, count)) }),
  toggleForeignRemoval: () => set((state) => ({ hasForeignRemoval: !state.hasForeignRemoval })),
  setDepositAmount: (depositAmount) => set({ depositAmount }),
  resetQuote: () =>
    set({
      selectedBaseId: 'structured-biab',
      selectedTier: 1,
      nailRepairsCount: 0,
      hasForeignRemoval: false,
      depositAmount: 25,
    }),

  getSelectedBase: () => {
    const { selectedBaseId } = get();
    return BASE_SERVICES.find((s) => s.id === selectedBaseId) || BASE_SERVICES[0];
  },

  getSelectedTierObj: () => {
    const { selectedTier } = get();
    return ART_TIERS.find((t) => t.tier === selectedTier) || ART_TIERS[0];
  },

  getTotalPrice: () => {
    const { selectedBaseId, selectedTier, nailRepairsCount, hasForeignRemoval } = get();
    const base = BASE_SERVICES.find((s) => s.id === selectedBaseId)?.price ?? 0;
    const tier = ART_TIERS.find((t) => t.tier === selectedTier)?.price ?? 0;
    const repairs = nailRepairsCount * NAIL_REPAIR_PRICE;
    const removal = hasForeignRemoval ? FOREIGN_REMOVAL_PRICE : 0;
    return base + tier + repairs + removal;
  },

  getTotalDuration: () => {
    const { selectedBaseId, selectedTier, nailRepairsCount, hasForeignRemoval } = get();
    const base = BASE_SERVICES.find((s) => s.id === selectedBaseId)?.duration ?? 0;
    const tier = ART_TIERS.find((t) => t.tier === selectedTier)?.duration ?? 0;
    const repairs = nailRepairsCount * NAIL_REPAIR_DURATION;
    const removal = hasForeignRemoval ? FOREIGN_REMOVAL_DURATION : 0;
    return base + tier + repairs + removal;
  },
}));
