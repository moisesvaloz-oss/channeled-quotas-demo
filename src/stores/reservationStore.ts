import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        const newReservation: Reservation = {
          ...reservation,
          id: orderId,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          reservations: [newReservation, ...state.reservations],
        }));
        
        return orderId;
      },
      
      updateReservationStatus: (id, status) => {
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

