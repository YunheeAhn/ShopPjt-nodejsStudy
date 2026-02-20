// product 기능 정의

// model 불러오기
const Product = require("../models/Product");

const productController = {};

// 상품 정보 생성하기
productController.createProduct = async (req, res) => {
  try {
    const { sku, name, size, image, category, description, price, stock, status } = req.body;
    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    });

    await product.save();
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 상품 정보 가져오기
productController.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
