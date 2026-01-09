import mongoose, { Schema, Document, type ObjectId } from "mongoose";
import type { IProduct } from "./productModel.js";

const cartStatusEnum = ["active", "complete"];

export interface ICartItem extends Document {
  product: IProduct;
  unitPrice: number;
  quantity: number;
}

export interface ICart extends Document {
  userID: ObjectId | string;
  items: ICartItem[];
  totalNumber: number;
  status: "active" | "complete";
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 0 },
  unitPrice: { type: Number, required: true },
});

const CartSchema = new Schema<ICart>({
  userID: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  items: [CartItemSchema],
  totalNumber: { type: Number, required: true, default: 0 },
  status: { type: String, enum: cartStatusEnum, default: "active" },
});

export const cartModel = mongoose.model<ICart>("Cart", CartSchema);
