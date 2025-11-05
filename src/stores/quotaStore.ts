import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Quota {
  id: string;
  name: string;
  type: 'Exclusive' | 'Shared' | 'Blocked';
  capacity: number;
  assignation: string; // Will be derived from application selection
  sold: number;
  available: number;
  capacityGroupName: string;
  timeSlot: string;
}

interface QuotaState {
  quotas: Quota[];
  addQuota: (quota: Omit<Quota, 'id' | 'sold' | 'available'>) => void;
  removeQuota: (id: string) => void;
  updateQuota: (id: string, updates: Partial<Omit<Quota, 'id' | 'sold' | 'available'>>) => void;
  updateQuotaCapacity: (id: string, newCapacity: number) => void;
  getQuotasByGroup: (capacityGroupName: string) => Quota[];
}

export const useQuotaStore = create<QuotaState>()(
  persist(
    (set, get) => ({
      quotas: [],
      addQuota: (quotaData) => {
        const newQuota: Quota = {
          ...quotaData,
          id: `quota-${Date.now()}`,
          sold: 0,
          available: quotaData.capacity,
        };
        set((state) => ({ quotas: [...state.quotas, newQuota] }));
      },
      removeQuota: (id) => {
        set((state) => ({ quotas: state.quotas.filter((q) => q.id !== id) }));
      },
      updateQuota: (id, updates) => {
        set((state) => ({
          quotas: state.quotas.map((q) => {
            if (q.id === id) {
              const updatedQuota = { ...q, ...updates };
              // Recalculate available if capacity changed
              if (updates.capacity !== undefined) {
                updatedQuota.available = updates.capacity - q.sold;
              }
              return updatedQuota;
            }
            return q;
          }),
        }));
      },
      updateQuotaCapacity: (id, newCapacity) => {
        set((state) => ({
          quotas: state.quotas.map((q) =>
            q.id === id
              ? { ...q, capacity: newCapacity, available: newCapacity - q.sold }
              : q
          ),
        }));
      },
      getQuotasByGroup: (capacityGroupName) => {
        return get().quotas.filter((q) => q.capacityGroupName === capacityGroupName);
      },
    }),
    {
      name: 'quota-storage',
    }
  )
);

