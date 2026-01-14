import express from "express";
import { generateAllProducts } from "../services/productServices.js";

const route = express.Router();

route.get("/", async (req, res) => {
  const products = await generateAllProducts();
  res.status(200).send(products);
});

export default route;
