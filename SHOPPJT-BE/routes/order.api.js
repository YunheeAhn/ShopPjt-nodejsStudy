//따로 분리 된 /order 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const orderController = require("../controller/order.controller");

// 오더 생성하기 endpoint 연결
router.post("/", authController.authenticate, orderController.createOrder);

// 라우터 모듈 내보내기
module.exports = router;
