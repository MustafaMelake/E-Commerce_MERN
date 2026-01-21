import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./cartContext";
import type { CartItem } from "../../types/CartItem";
import { BASE_URL } from "../../constants/BaseUrl";
import { useAuth } from "../auth/authContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItem, setCartItems] = useState<CartItem[]>([]);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const [, setError] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    const FetchData = async () => {
      const res = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.text(); // قراءة الخطأ كنص أولاً
        console.error("Cart Error:", errorData);
        return;
      }
      const cart = await res.json();

      const cartItemsMapped: CartItem[] = cart.items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({
          product,
          quantity,
          unitPrice,
        }: {
          product: any;
          quantity: number;
          unitPrice: number;
        }) => ({
          productID: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );
      setTotalNumber(cart.totalNumber); // تحديث الإجمال
      setCartItems(cartItemsMapped);
    };
    FetchData();
  }, [token]);

  const addItemToCart = async (productID: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productID,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        setError("Failed to add to cart");
      }

      const result = await response.json();
      const cart = result.data;

      if (!cart) {
        setError("Failed to parse cart data");
        return;
      }

      setTotalNumber(cart.totalNumber);
    } catch (error) {
      console.log(error);
    }
  };
  const updateItemInCart = async (productID: string, quantity: number) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productID,
          quantity,
        }),
      });

      if (!response.ok) {
        setError("Failed to update to cart");
      }
      const cart = await response.json();
      if (!cart) {
        setError("Failed to parse cart data");
      }

      const cartItemsMapped: CartItem[] = cart.items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({
          product,
          quantity,
          unitPrice,
        }: {
          product: any;
          quantity: number;
          unitPrice: number;
        }) => ({
          productID: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );
      setTotalNumber(cart.totalNumber); // تحديث الإجمال
      setCartItems(cartItemsMapped);
    } catch (error) {
      console.error(error);
    }
  };

  const removeItemInCart = async (productID: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items/${productID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to delete to cart");
      }

      const cart = await response.json();

      if (!cart) {
        setError("Failed to parse cart data");
      }

      const cartItemsMapped = cart.items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({
          product,
          quantity,
          unitPrice,
        }: {
          product: any;
          quantity: number;
          unitPrice: number;
        }) => ({
          productID: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );

      setCartItems(cartItemsMapped);
      setTotalNumber(cart.totalAmount);
    } catch (error) {
      console.error(error);
    }
  };
  const clearCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to empty to cart");
      }

      const cart = await response.json();

      if (!cart) {
        setError("Failed to parse cart data");
      }

      setCartItems([]);
      setTotalNumber(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItem,
        totalNumber,
        addItemToCart,
        updateItemInCart,
        removeItemInCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
