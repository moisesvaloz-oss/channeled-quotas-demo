import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Business {
  id: string;
  name: string;
  type: string;
  phone?: string;
  email?: string;
  contactName?: string;
  contactPhone?: string;
  address?: string;
  enabled: boolean;
}

interface BusinessState {
  businesses: Business[];
  addBusiness: (business: Business) => void;
  updateBusiness: (id: string, business: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
}

// Default businesses to pre-populate
const defaultBusinesses: Business[] = [
  { id: crypto.randomUUID(), name: 'Complimentary - Marketing', type: 'Internal operations', enabled: true },
  { id: crypto.randomUUID(), name: 'Complimentary - Employee', type: 'Internal operations', enabled: true },
  { id: crypto.randomUUID(), name: 'Consignment - Logitix', type: 'Agency', enabled: true },
  { id: crypto.randomUUID(), name: 'Consignment - EBG', type: 'Agency', enabled: true },
  { id: crypto.randomUUID(), name: 'LIV Golf - Marketing', type: 'Partnerships', enabled: true },
  { id: crypto.randomUUID(), name: 'LIV Golf - Partnership', type: 'Partnerships', enabled: true },
  { id: crypto.randomUUID(), name: 'Partnership Fulfillment - Google', type: 'Partnerships', enabled: true },
  { id: crypto.randomUUID(), name: 'Partnership Fulfillment - HSBC', type: 'Partnerships', enabled: true },
  { id: crypto.randomUUID(), name: 'Sales Rep - Liam Ackerman', type: 'Sales Representative', enabled: true },
  { id: crypto.randomUUID(), name: 'Sales Rep - Aaron Clarke', type: 'Sales Representative', enabled: true },
  { id: crypto.randomUUID(), name: 'Ticket Ops - Joe Occorso', type: 'Internal operations', enabled: true }
];

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      businesses: defaultBusinesses,
      addBusiness: (business) =>
        set((state) => ({
          businesses: [...state.businesses, business],
        })),
      updateBusiness: (id, updatedBusiness) =>
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === id ? { ...b, ...updatedBusiness } : b
          ),
        })),
      deleteBusiness: (id) =>
        set((state) => ({
          businesses: state.businesses.filter((b) => b.id !== id),
        })),
    }),
    {
      name: 'business-storage',
      // Merge function to ensure default businesses are always present on first load
      merge: (persistedState, currentState) => {
        const stored = persistedState as BusinessState;
        // If there are stored businesses, use them; otherwise use defaults
        if (stored && stored.businesses && stored.businesses.length > 0) {
          return stored;
        }
        return currentState;
      },
    }
  )
);

