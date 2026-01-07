import { productModel } from "../models/productModel.js";

export const generateAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
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
};
