import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

interface CartContextType {
  cartItem: CartItem[];
  totalNumber: number;
  addItemToCart: (productID: string) => void;
  updateItemInCart: (productID: string, quantity: number) => void;
  removeItemInCart: (productID: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItem: [],
  totalNumber: 0,
  addItemToCart: () => {},
  updateItemInCart: () => {},
  removeItemInCart: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);
