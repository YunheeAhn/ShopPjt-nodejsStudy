//따로 분리 된 /cart 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const cartController = require("../controller/cart.controller");

// 카트에 아이템 추가 endpoint 연결
router.post("/", authController.authenticate, cartController.addItemToCart);

// 라우터 모듈 내보내기
module.exports = router;
