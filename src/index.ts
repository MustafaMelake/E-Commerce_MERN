import express from "express";
import mongoose from "mongoose";
import userRoute from "./Routes/userRoute.js";

const app = express();
const port = 3001;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("MONGOOSE Connected!"))
  .catch((err) => {
    console.log("error", err);
  });

app.use("/user", userRoute);

app.listen(port, () => {
  console.log("Server is Running");
});
