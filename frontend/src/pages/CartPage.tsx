import React, { useEffect, useState } from "react";
import { BASE_URL } from "../constants/BaseUrl";
import { useAuth } from "../context/auth/authContext";
import { Container, Typography } from "@mui/material";

const CartPage = () => {
  const { token } = useAuth();
  const [cart, setCart] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    const FetchData = async () => {
      if (!token) {
        return;
      }
      const res = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        setError("Failed to fetch user cart. Please try again");
      }
      const data = await res.json();
      setCart(data);
    };
    FetchData();
  }, [token]);
  console.log(cart);
  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4">My Cart</Typography>
    </Container>
  );
};

export default CartPage;
