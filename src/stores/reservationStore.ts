import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { consumeReservationCapacity, releaseReservationCapacity } from '../services/capacityService';
import { useBusinessStore } from './businessStore';

export interface Reservation {
  id: string; // Order ID like R96628515
  eventName: string;
  eventImage: string;
  venueName: string;
  venueAddress: string;
  date: string;
  time: string;
  tickets: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  bookingFees: number;
  status: 'to-be-paid' | 'paid' | 'cancelled';
  paymentMethod?: string;
  createdAt: string;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  businessId?: string; // ID of the business that made the reservation
  businessName?: string;
  businessType?: string;
  quotaConsumption?: Array<{ quotaId: string; consumed: number; ticketName: string }>; // Track which quotas were consumed
}

interface ReservationState {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => string;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  getReservationById: (id: string) => Reservation | undefined;
  deleteReservation: (id: string) => void;
}

// Generate unique order ID like R96628515
const generateOrderId = (): string => {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `R${randomNum}`;
};

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      reservations: [],
      
      addReservation: (reservation) => {
        const orderId = generateOrderId();
        
        // Get business info if businessId is provided
        let business = null;
        if (reservation.businessId) {
          business = useBusinessStore.getState().businesses.find(b => b.id === reservation.businessId) || null;
        }
        
        // Consume capacity from quotas (regardless of payment status)
        const quotaConsumption = consumeReservationCapacity(
          reservation.tickets,
          business
        );
        
        const newReservation: Reservation = {
          ...reservation,
          id: orderId,
          createdAt: new Date().toISOString(),
          quotaConsumption: quotaConsumption.length > 0 ? quotaConsumption : undefined,
        };
        
        set((state) => ({
          reservations: [newReservation, ...state.reservations],
        }));
        
        return orderId;
      },
      
      updateReservationStatus: (id, status) => {
        const reservation = get().reservations.find((res) => res.id === id);
        
        // If cancelling a non-cancelled reservation, release capacity
        if (reservation && status === 'cancelled' && reservation.status !== 'cancelled') {
          // Release quota capacity if any was consumed
          if (reservation.quotaConsumption && reservation.quotaConsumption.length > 0) {
            releaseReservationCapacity(reservation.quotaConsumption, reservation.tickets);
          } else {
            // No quota consumption - still need to release base capacity
            releaseReservationCapacity([], reservation.tickets);
          }
        }
        
        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.id === id ? { ...res, status } : res
          ),
        }));
      },
      
      getReservationById: (id) => {
        return get().reservations.find((res) => res.id === id);
      },
      
      deleteReservation: (id) => {
        const reservation = get().reservations.find((res) => res.id === id);
        
        // Release capacity when deleting a non-cancelled reservation
        if (reservation && reservation.status !== 'cancelled') {
          // Release quota capacity if any was consumed
          if (reservation.quotaConsumption && reservation.quotaConsumption.length > 0) {
            releaseReservationCapacity(reservation.quotaConsumption, reservation.tickets);
          } else {
            // No quota consumption - still need to release base capacity
            releaseReservationCapacity([], reservation.tickets);
          }
        }
        
        set((state) => ({
          reservations: state.reservations.filter((res) => res.id !== id),
        }));
      },
    }),
    {
      name: 'reservation-storage',
    }
  )
);

