import express from "express";
import { getCartForUser } from "../services/cartServices.js";
import validateJWT from "../middlewares/validateJWT.js";
import type { ExtendReq } from "../types/express.js";
import {
  addToCart,
  checkout,
  clearCart,
  DeleteFromCart,
  UpdatedToCart,
} from "../services/productServices.js";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendReq, res) => {
  const userID = req?.user?._id;
  const cart = await getCartForUser({ userID });
  res.status(200).send(cart);
});

router.delete("/", validateJWT, async (req: ExtendReq, res) => {
  const userID = req?.user?._id;
  const response = await clearCart({ userID });
  res.status(response.statusCode).send(response.data);
});

router.post("/items", validateJWT, async (req: ExtendReq, res) => {
  const userID = req?.user?._id;
  const { productID, quantity } = req.body;
  const response = await addToCart({ userID, productID, quantity });
  res.status(response.statusCode).send(response.data);
});

router.put("/items", validateJWT, async (req: ExtendReq, res) => {
  const userID = req?.user?._id;
  const { productID, quantity } = req.body;
  const response = await UpdatedToCart({ userID, productID, quantity });
  res.status(response.statusCode).send(response.data);
});

router.delete("/items/:productID", validateJWT, async (req: ExtendReq, res) => {
  const userID = req?.user?._id;
  const { productID } = req.params;
  const response = await DeleteFromCart({ productID, userID });
  res.status(response.statusCode).send(response.data);
});

router.post("/checkout", validateJWT, async (req: ExtendReq, res) => {
  const userID = req?.user?._id;
  const { address } = req.body;
  const response = await checkout({ userID, address });
  res.status(response.statusCode).send(response.data);
});

export default router;
