import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { BASE_URL } from "../constants/BaseUrl";
import type { Product } from "../types/Product";

const HomePage = () => {
  const [products, setProduct] = useState<Product>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respone = await fetch(`${BASE_URL}/product`);
        const data = await respone.json();
        setProduct(data);
      } catch {
        setError(true);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <Box>Something went wrong, please try again!</Box>;
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item md={4}>
            <ProductCard {...p} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
