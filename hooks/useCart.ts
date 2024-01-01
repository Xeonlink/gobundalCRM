import { CartProduct, Product } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartStore {
  candidate: Product | null;
  setCandidate: (product: Product) => void;
  clearCandidate: () => void;
  products: CartProduct[];
  addProduct: (product: Product) => void;
  removeProduct: (idx: number) => void;
  setQuantity: (payload: { id: string; value: number | ((prev: number) => number) }) => void;
  reset: () => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      candidate: null,
      setCandidate: (product: Product) => set({ candidate: product }),
      clearCandidate: () => set({ candidate: null }),
      //
      products: [],
      addProduct: (product: Product) => {
        const idx = get().products.findIndex((p) => p.item.id === product.id);
        if (idx !== -1) {
          get().setQuantity({ id: product.id, value: (prev) => prev + 1 });
          return;
        }

        const newCartProduct = { item: product, quantity: 1 };
        set({ products: [...get().products, newCartProduct] });
      },
      removeProduct: (idx: number) => set({ products: get().products.filter((_, i) => i !== idx) }),
      setQuantity: (payload) => {
        const { id, value } = payload;
        const idx = get().products.findIndex((p) => p.item.id === id);
        if (idx === -1) return;
        const products = [...get().products];
        const quantity = typeof value === "function" ? value(products[idx].quantity) : value;
        if (quantity < 1) return;
        products[idx].quantity = quantity;
        set({ products });
      },
      reset: () => set({ products: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
