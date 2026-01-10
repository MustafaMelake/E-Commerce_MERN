import express from "express";
import { getCartForUser } from "../services/cartServices.js";
import validateJWT from "../middlewares/validateJWT.js";
import type { ExtendReq } from "../types/express.js";
import { addToCart } from "../services/productServices.js";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendReq, res) => {
  const userID = req?.user?._id;
  const cart = await getCartForUser({ userID });
  res.status(200).send(cart);
});

router.post("/items", validateJWT, async (req: ExtendReq, res) => {
  const userID = req?.user?._id;
  const { productID, quantity } = req.body;
  const response = await addToCart({ userID, productID, quantity });
  res.status(response.statusCode).send(response.data);
});

export default router;
