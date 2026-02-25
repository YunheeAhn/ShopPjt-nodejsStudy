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

// 상품 정보 수정하기
productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { sku, name, size, image, category, description, price, stock, status } = req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { name, size, image, category, description, price, stock, status },
      { new: true },
    );
    if (!product) {
      throw new Error("Item doesn't exist");
    }
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 상품 정보 삭제하기
productController.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ status: "fail", error: "상품을 찾을 수 없습니다" });
    }

    return res.status(200).json({ status: "success", data: deleted });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 상품 상세정보 가져오기
productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) throw new Error("No item found");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 상품 재고 확인하기
productController.checkStock = async (item) => {
  // 내가 사려는 아이템 재고 정보 들고오기
  const product = await Product.findById(item.productId);
  if (!product) {
    return { isVerify: false, message: "상품을 찾을 수 없습니다" };
  }

  // 내가 사려는 아이템 qty, 재고 비교하기
  if (product.stock[item.size] < item.qty) {
    // 재고 불충하다면 불충분 메세지, 데이터 반환
    return { isVerify: false, message: `${product.name}의 ${item.size} 재고가 부족합니다` };
  }

  // 충분하다면 재고에서 qty 빼기 성공
  const newStock = { ...product.stock };
  newStock[item.size] -= item.qty;
  product.stock = newStock;

  await product.save();
  return { isVerify: true };
};

// 상품의 불충분한 아이템 리스트 만들기
productController.checkItemListStock = async (itemList) => {
  // 불충분한 재고 확인
  const insufficientStockItems = [];
  await Promise.all(
    itemList.map(async (item) => {
      const stockCheck = await productController.checkStock(item);
      if (!stockCheck.isVerify) {
        insufficientStockItems.push({ item, message: stockCheck.message });
      }
      return stockCheck;
    }),
  );

  return insufficientStockItems;
};

module.exports = productController;
