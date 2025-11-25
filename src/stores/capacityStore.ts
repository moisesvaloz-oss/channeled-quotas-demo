import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CapacitySoldCounts {
  groups: Record<string, number>; // groupName -> sold count
  tickets: Record<string, Record<string, number>>; // groupName -> ticketOption -> sold count
}

interface CapacityState {
  soldCounts: CapacitySoldCounts;
  incrementGroupSold: (groupName: string, quantity: number) => void;
  decrementGroupSold: (groupName: string, quantity: number) => void;
  incrementTicketSold: (groupName: string, ticketOption: string, quantity: number) => void;
  decrementTicketSold: (groupName: string, ticketOption: string, quantity: number) => void;
  getGroupSold: (groupName: string) => number;
  getTicketSold: (groupName: string, ticketOption: string) => number;
}

export const useCapacityStore = create<CapacityState>()(
  persist(
    (set, get) => ({
      soldCounts: {
        groups: {},
        tickets: {},
      },
      
      incrementGroupSold: (groupName, quantity) => {
        set((state) => ({
          soldCounts: {
            ...state.soldCounts,
            groups: {
              ...state.soldCounts.groups,
              [groupName]: (state.soldCounts.groups[groupName] || 0) + quantity,
            },
          },
        }));
      },
      
      decrementGroupSold: (groupName, quantity) => {
        set((state) => ({
          soldCounts: {
            ...state.soldCounts,
            groups: {
              ...state.soldCounts.groups,
              [groupName]: Math.max(0, (state.soldCounts.groups[groupName] || 0) - quantity),
            },
          },
        }));
      },
      
      incrementTicketSold: (groupName, ticketOption, quantity) => {
        set((state) => ({
          soldCounts: {
            ...state.soldCounts,
            tickets: {
              ...state.soldCounts.tickets,
              [groupName]: {
                ...(state.soldCounts.tickets[groupName] || {}),
                [ticketOption]: ((state.soldCounts.tickets[groupName]?.[ticketOption] || 0) + quantity),
              },
            },
          },
        }));
      },
      
      decrementTicketSold: (groupName, ticketOption, quantity) => {
        set((state) => ({
          soldCounts: {
            ...state.soldCounts,
            tickets: {
              ...state.soldCounts.tickets,
              [groupName]: {
                ...(state.soldCounts.tickets[groupName] || {}),
                [ticketOption]: Math.max(0, (state.soldCounts.tickets[groupName]?.[ticketOption] || 0) - quantity),
              },
            },
          },
        }));
      },
      
      getGroupSold: (groupName) => {
        return get().soldCounts.groups[groupName] || 0;
      },
      
      getTicketSold: (groupName, ticketOption) => {
        return get().soldCounts.tickets[groupName]?.[ticketOption] || 0;
      },
    }),
    {
      name: 'capacity-storage',
    }
  )
);

