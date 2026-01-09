import { cartModel } from "../models/cartModel.js";

interface creatCartForUser {
  userID: string;
}

const creatCartForUser = async ({ userID }: creatCartForUser) => {
  const cart = await cartModel.create({ userID, totalNumber: 0 });
  return cart;
};

interface getCartForUser {
  userID: string;
}

export const getCartForUser = async ({ userID }: getCartForUser) => {
  let cart = await cartModel.findOne({ userID, status: "active" });

  if (!cart) {
    cart = await creatCartForUser({ userID });
  }

  return cart;
};
