import { Product } from "./sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

interface CartState extends WishlistState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupsItems: () => CartItem[];
  getWishlistCount: () => Product[];
}

const userCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      // Add a product to the cart
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),

      // Remove an item or decrease quantity in the cart
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),

      // Delete an item entirely from the cart
      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter(({ product }) => product._id !== productId),
        })),

      // Reset the entire cart
      resetCart: () =>
        set(() => ({
          items: [],
        })),

      // Get the total price of all items in the cart
      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        ),

      // Get subtotal price with discounts
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const discount = ((item.product.discount ?? 0) * price) / 100;
          const discountedPrice = price - discount;
          return total + discountedPrice * item.quantity;
        }, 0);
      },

      // Get the count of a specific item in the cart
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },

      // Get all items grouped
      getGroupsItems: () => get().items,

      // Add a product to the wishlist
    toggleWishlist: (product) => {
        const currentWishlist = get().wishlist;
        const isInWishlist = currentWishlist.some((item) => item._id === product._id);

        if (isInWishlist) {
          set({
            wishlist: currentWishlist.filter((item) => item._id !== product._id),
          });
        } else {
          set({ wishlist: [...currentWishlist, product] });
        }
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item._id === productId);
      },
    // }),
      getWishlistCount: () => get().wishlist,
    }),
    { name: "cart-store" }
  )
);

export default userCartStore;
