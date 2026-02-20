//따로 분리 된 /product 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const productController = require("../controller/product.controller");

// 상품 생성 endpoint 연결
router.post(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  productController.createProduct,
);

// 상품 가져오기 endpoint 연결
router.get("/", productController.getProducts);

// 라우터 모듈 내보내기
module.exports = router;
