import { create } from 'zustand';

export interface CartItem {
  id: string;
  ticketName: string;
  date: string;
  time: string;
  quantity: number;
  price: number;
  bookingFee: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
    
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: quantity > 0
        ? state.items.map(item => item.id === id ? { ...item, quantity } : item)
        : state.items.filter(item => item.id !== id),
    })),
    
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter(item => item.id !== id),
    })),
    
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
}));

