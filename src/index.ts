import express from "express";
import mongoose from "mongoose";
import userRoute from "./Routes/userRoute.js";
import { seedInitialProducts } from "./services/productServices.js";
import productRoute from "./Routes/productRoute.js";

const app = express();
const port = 3001;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("MONGOOSE Connected!"))
  .catch((err) => {
    console.log("error", err);
  });

seedInitialProducts();

app.use("/user", userRoute);
app.use("/product", productRoute);

app.listen(port, () => {
  console.log("Server is Running");
});
