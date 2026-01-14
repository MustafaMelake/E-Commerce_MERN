import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./Routes/userRoute.js";
import { seedInitialProducts } from "./services/productServices.js";
import productRoute from "./Routes/productRoute.js";
import cartRoute from "./Routes/cartRoute.js";

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("MONGOOSE Connected!"))
  .catch((err) => {
    console.log("error", err);
  });

seedInitialProducts();

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);

app.listen(port, () => {
  console.log("Server is Running");
});
