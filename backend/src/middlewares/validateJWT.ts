import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import type { ExtendReq } from "../types/express.js";
import dotenv from "dotenv";
dotenv.config();

const validateJWT = (req: ExtendReq, res: Response, next: NextFunction) => {
  const authorisationHeader = req.get("Authorization");
  if (!authorisationHeader) {
    res.status(403).send("Authorization header was not provided");
    return;
  }
  const token = authorisationHeader.split(" ")[1];
  console.log("Token received:", token);
  if (!token) {
    res.status(403).send("Bearer token not found");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || "", async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token!" });
    }

    if (!payload) {
      res.status(403).send("Invalid token payload");
      return;
    }
    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    // Fetch User from Database based on payload.

    const user = await userModel.findOne({
      email: userPayload.email,
    });
    req.user = user;
    next();
  });
};

export default validateJWT;
