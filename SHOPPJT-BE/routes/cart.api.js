//따로 분리 된 /cart 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const cartController = require("../controller/cart.controller");

// 카트에 아이템 추가 endpoint 연결
router.post("/", authController.authenticate, cartController.addItemToCart);

// 카트에 추가된 아이템 불러오기 endpoint 연결
router.get("/", authController.authenticate, cartController.getCartList);

// 카트 아이템 삭제 endpoint 연결
router.delete("/:id", authController.authenticate, cartController.deleteCartItem);

// 카트 아이템 수 endpoint 연결
router.get("/qty", authController.authenticate, cartController.getCartQty);

// 라우터 모듈 내보내기
module.exports = router;
