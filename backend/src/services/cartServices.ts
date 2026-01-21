import { populate } from "dotenv";
import { cartModel } from "../models/cartModel.js";
import { orderModel, type IOrderItem } from "../models/orderModel.js";
import { productModel } from "../models/productModel.js";

interface creatCartForUser {
  userID: string;
}

const creatCartForUser = async ({ userID }: creatCartForUser) => {
  const cart = await cartModel.create({ userID, totalNumber: 0 });
  return cart;
};

interface getCartForUser {
  userID: string;
  populateProduct?: boolean;
}

export const getCartForUser = async ({
  userID,
  populateProduct,
}: getCartForUser) => {
  let cart;
  if (populateProduct) {
    cart = await cartModel
      .findOne({ userID, status: "active" })
      .populate("items.product");
  } else {
    cart = await cartModel.findOne({ userID, status: "active" });
  }

  if (!cart) {
    cart = await creatCartForUser({ userID });
  }

  return cart;
};

interface IaddToCart {
  productID: any;
  quantity: number;
  userID: string;
}

export const addToCart = async ({
  productID,
  quantity,
  userID,
}: IaddToCart) => {
  const cart = await getCartForUser({ userID });
  const existInCart = cart.items.find(
    (p) => p.product.toString() === productID.toString()
  );
  if (existInCart) {
    return { data: "I am already exists in cart!", statusCode: 400 };
  }
  const product = await productModel.findById(productID);
  if (!product) {
    return { data: "Item Not Found!", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "No Stock", statusCode: 400 };
  }

  cart.items.push({
    product: productID,
    unitPrice: product.price,
    quantity,
  });

  cart.totalNumber = cart.items.reduce(
    (sum: number, item: { quantity: number; unitPrice: number }) =>
      sum + item.quantity * item.unitPrice,
    0
  );

  await cart.save();
  return {
    data: await getCartForUser({ userID, populateProduct: true }),
    statusCode: 200,
  };
};

interface ClearCart {
  userID: string;
}
export const clearCart = async ({ userID }: ClearCart) => {
  const cart = await getCartForUser({ userID });
  cart.items = [];
  cart.totalNumber = 0;
  const updatedCart = await cart.save();
  return {
    data: await getCartForUser({ userID, populateProduct: true }),
    statusCode: 200,
  };
};

interface IUpdatedToCart {
  productID: any;
  quantity: number;
  userID: string;
}

export const UpdatedToCart = async ({
  productID,
  quantity,
  userID,
}: IUpdatedToCart) => {
  const cart = await getCartForUser({ userID });
  const existInCart = cart.items.find(
    (p) => p.product.toString() === productID
  );
  if (!existInCart) {
    return { data: "Item not exists in cart!", statusCode: 400 };
  }

  const product = await productModel.findById(productID);
  if (!product) {
    return { data: "Item Not Found!", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "No Stock", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productID
  );

  let total = otherCartItems.reduce(
    (sum: number, product: { quantity: number; unitPrice: number }) => {
      sum += product.quantity * product.unitPrice;
      return sum;
    },
    0
  );

  existInCart.quantity = quantity;
  total += existInCart.quantity * existInCart.unitPrice;

  cart.totalNumber += total;

  await cart.save();
  return {
    data: await getCartForUser({ userID, populateProduct: true }),
    statusCode: 200,
  };
};

interface IDeleteFromCart {
  productID: any;
  userID: string;
}

export const DeleteFromCart = async ({
  productID,
  userID,
}: IDeleteFromCart) => {
  const cart = await getCartForUser({ userID });

  const existInCart = cart.items.find(
    (p) => p.product.toString() === productID
  );

  if (!existInCart) {
    return { data: "Item not exists in cart!", statusCode: 400 };
  }

  // Filter out the item to be deleted
  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productID
  );

  // Calculate the new total by summing remaining items
  const newTotal = otherCartItems.reduce(
    (sum: number, product: { quantity: number; unitPrice: number }) => {
      sum += product.quantity * product.unitPrice;
      return sum;
    },
    0
  );

  // Update cart with new items and new total
  cart.items = otherCartItems;
  cart.totalNumber = newTotal; // Use = instead of +=

  await cart.save();
  return {
    data: await getCartForUser({ userID, populateProduct: true }),
    statusCode: 200,
  };
};

interface ICheckout {
  userID: string;
  address: string;
}

export const checkout = async ({ userID, address }: ICheckout) => {
  if (!address) {
    return { data: "Please add the address", statusCode: 400 };
  }

  const cart = await getCartForUser({ userID });

  const orderItems: IOrderItem[] = [];
  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    if (!product) {
      return { data: "Product not found", statusCode: 400 };
    }

    const orderItem: IOrderItem = {
      productTitle: product.title,
      productImage: product.image,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    };

    orderItems.push(orderItem);
  }

  const order = await orderModel.create({
    orderItems,
    total: cart.totalNumber,
    address,
    userID,
  });

  await order.save();

  // Update the cart status to be completed
  cart.status = "complete";
  await cart.save();
  return { data: order, statusCode: 200 };
};
