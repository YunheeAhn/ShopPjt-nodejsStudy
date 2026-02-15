//따로 분리 된 /auth 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const productController = require("../controller/product.controller");

router.post(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  productController.createProduct,
);

// 라우터 모듈 내보내기
module.exports = router;
