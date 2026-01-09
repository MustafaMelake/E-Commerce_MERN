import express from "express";
import { getCartForUser } from "../services/cartServices.js";
import validateJWT from "../middlewares/validateJWT.js";

const router = express.Router();

router.get("/", validateJWT, async (req, res) => {
  const userID = req.user._id;
  const cart = await getCartForUser({ userID });
  res.status(200).send(cart);
});

export default router;
