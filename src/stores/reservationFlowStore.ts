import { create } from 'zustand';
import type { Business } from './businessStore';

interface ReservationFlowState {
  selectedBusiness: Business | null;
  setSelectedBusiness: (business: Business | null) => void;
  clearFlow: () => void;
}

export const useReservationFlowStore = create<ReservationFlowState>((set) => ({
  selectedBusiness: null,
  setSelectedBusiness: (business) => set({ selectedBusiness: business }),
  clearFlow: () => set({ selectedBusiness: null }),
}));

