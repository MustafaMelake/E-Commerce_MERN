import { Box, Container, Typography } from "@mui/material";
import { useCart } from "../context/cart/cartContext";

const CartPage = () => {
  const { cartItem } = useCart();

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4">
        My Cart
        {cartItem.map((item) => (
          <Box>{item.title}</Box>
        ))}
      </Typography>
    </Container>
  );
};

export default CartPage;
