import { productModel } from "../models/productModel.js";

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
