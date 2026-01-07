import express from "express";
import { login, register } from "../services/userServices.js";

const router = express.Router();

// register

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { statusCode, data } = await register({
    firstName,
    lastName,
    email,
    password,
  });
  res.status(statusCode).send(data);
});

// login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { statusCode, data } = await login({ email, password });
  res.status(statusCode).send(data);
});

export default router;
