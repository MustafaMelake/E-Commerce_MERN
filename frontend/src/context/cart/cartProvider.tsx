import { useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./cartContext";
import type { CartItem } from "../../types/CartItem";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItem, setCartItems] = useState<CartItem[]>([]);
  const [totalNumber, setTotalNumber] = useState<number>(0);

  const addItemToCart = (productID: string) => {
    console.log(productID);
  };

  return (
    <CartContext.Provider
      value={{
        cartItem,
        totalNumber,
        addItemToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
