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
      // { title: "Product 2", image: "image2. jpg", price: 20, stock: 80 },
      // { title: "Product 3", image: "image3.jpg", price: 15, stock: 50 },
      // { title: "Product 4", image: "image4. jpg", price: 25, stock: 70 },
      // { title: "Product 5", image: "image5. jpg", price: 5, stock: 90 },
      // { title: "Product 6", image: "image6. jpg", price: 30, stock: 60 },
      // { title: "Product 7", image: "image7. jpg", price: 35, stock: 40 },
      // { title: "Product 8", image: "image8.jpg", price: 40, stock: 30 },
      // { title: "Product 9", image: "image9.jpg", price: 40, stock: 30 },
      // { title: "Product 10", image: "image10.jpg", price: 40, stock: 30 },
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
