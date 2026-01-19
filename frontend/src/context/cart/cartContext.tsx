import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

interface CartContextType {
  cartItem: CartItem[];
  totalNumber: number;
  addItemToCart: (productID: string) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItem: [],
  totalNumber: 0,
  addItemToCart: () => {},
});

export const useCart = () => useContext(CartContext);
