import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

interface ExtendReq extends Request {
  user?: any;
}

const validateJWT = (req: ExtendReq, res: Response, next: NextFunction) => {
  const authorisationHeader = req.get("Authorization");
  if (!authorisationHeader) {
    res.status(403).send("Authorization header was not provided");
    return;
  }
  const token = authorisationHeader.split(" ")[1];
  if (!token) {
    res.status(403).send("Bearer token not found");
    return;
  }

  jwt.verify(
    token,
    "T3X8MUtLy0zlF7iRDoYrykWIcPch9VhQ1yZmYsao7OA6wY8aslr3armnnwI0JdDJ",
    async (err, payload) => {
      if (err) {
        res.status(403).send("Invalid Token!");
        return;
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
    }
  );
};

export default validateJWT;
