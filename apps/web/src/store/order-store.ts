import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderState {
  orderId: string | null;
  setOrderId: (id: string) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orderId: null,
      setOrderId: (id) => set({ orderId: id }),
      clearOrder: () => set({ orderId: null }),
    }),
    {
      name: 'order-storage',
    }
  )
);
