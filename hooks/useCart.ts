import { OrderProduct } from "@/api/orders";
import { Product } from "@/api/products";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartProduct = {
  item: Product;
  quantity: number;
};

interface CartStore {
  products: CartProduct[];
  addProduct: (product: Product) => void;
  removeProduct: (idx: number) => void;
  increaseQuantity: (idx: number) => void;
  decreaseQuantity: (idx: number) => void;
  changeQuantity: (payload: { id: string; offset: number }) => void;
  reset: () => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      products: [],
      //
      addProduct: (product: Product) => {
        const idx = get().products.findIndex((p) => p.item.id === product.id);
        if (idx !== -1) {
          get().increaseQuantity(idx);
          return;
        }

        const newCartProduct = { item: product, quantity: 1 };
        set({ products: [...get().products, newCartProduct] });
      },
      removeProduct: (idx: number) => {
        set({
          products: get().products.filter((_, i) => i !== idx),
        });
      },
      increaseQuantity: (idx: number) => {
        const products = [...get().products];
        products[idx].quantity++;
        set({ products });
      },
      changeQuantity: (payload: { id: string; offset: number }) => {
        const products = [...get().products];
        const idx = products.findIndex((p) => p.item.id === payload.id);
        if (idx === -1) return;
        products[idx].quantity += payload.offset;
        set({ products });
      },
      decreaseQuantity: (idx: number) => {
        const products = [...get().products];
        if (products[idx].quantity === 1) return;
        products[idx].quantity--;
        set({ products });
      },
      reset: () => {
        set({ products: [] });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
