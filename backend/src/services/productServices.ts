import type { ICart, ICartItem } from "../models/cartModel.js";
import { orderModel, type IOrderItem } from "../models/orderModel.js";
import { productModel } from "../models/productModel.js";
import type { ExtendReq } from "../types/express.js";
import { getCartForUser } from "./cartServices.js";

export const generateAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: "Microsoft Surface Laptop",
        image:
          "https://top10-eg.com/product/microsoft-surface-laptop-3/?srsltid=AfmBOorL6h3LzoYbMQszgzmfSCfocn_55v9QPBLbk7-xRa-cmImiotXv",
        price: 60000,
        stock: 10,
      },
      {
        title: "Iphone 17 Pro",
        image:
          "https://assets-dubaiphone.dubaiphone.net/dp-prod/wp-content/uploads/2025/09/Apple-IPhone-17-Pro-With-FaceTime-512GB-12GB-RAM-_6086_1.webp",
        price: 47000,
        stock: 12,
      },
      {
        title: "Airpods",
        image:
          "https://ennap.com/cdn/shop/files/airpods-4-select-202409_FV1.jpg?v=1727106364",
        price: 12000,
        stock: 5,
      },
    ];

    const existingProduct = await generateAllProducts();
    if (existingProduct.length === 0) {
      await productModel.insertMany(products);
    }
  } catch (err) {
    console.error("cannot see database", err);
  }
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
    (p) => p.product.toString() === productID
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

  cart.totalNumber += product.price * quantity;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface ClearCart {
  userID: string;
}
export const clearCart = async ({ userID }: ClearCart) => {
  const cart = await getCartForUser({ userID });
  cart.items = [];
  cart.totalNumber = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
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

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
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

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
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
