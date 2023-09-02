import { create } from "zustand";

export const usePayment = create((set, get) => ({
  payment: {},
  setPayment: (payment: any) => set({ payment }),
  resetPayment: () => set({ payment: {} }),
}));
