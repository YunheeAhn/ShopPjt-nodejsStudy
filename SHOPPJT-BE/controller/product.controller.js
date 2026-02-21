// product 기능 정의

// model 불러오기
const Product = require("../models/Product");

const PAGE_SIZE = 5;

const productController = {};

// 상품 정보 생성하기
productController.createProduct = async (req, res) => {
  try {
    const { sku, name, size, image, category, description, price, stock, status } = req.body;

    // 이미지 공백인 경우
    const normalizedImage =
      typeof image === "string" && image.trim().length > 0 ? image.trim() : undefined;

    const product = new Product({
      sku,
      name,
      size,
      image: normalizedImage,
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
    // 쿼리 값 읽어오기
    const page = Number(req.query.page || 1);
    const name = req.query.name;

    // 어드민, 랜딩 페이지 프로덕트 수 다르게
    const pageSize = Number(req.query.pageSize || PAGE_SIZE);

    // 검색조건 선언
    // regex : query를 포함한 name까지, option-i : 대소문자 구분X
    const cond = name ? { name: { $regex: name, $options: "i" } } : {};

    // 페이지 값이 있는 경우 추가
    const totalItemNum = await Product.countDocuments(cond);
    const totalPageNum = Math.ceil(totalItemNum / pageSize);

    const productList = await Product.find(cond)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    // 검색조건 따로 실행
    res.status(200).json({
      status: "success",
      data: productList,
      totalItemNum,
      totalPageNum,
      page,
      pageSize,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
