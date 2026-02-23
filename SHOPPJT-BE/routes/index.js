// 라우터 정의

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const userApi = require("./user.api");
const authApi = require("./auth.api");
const productApi = require("./product.api");
const cartApi = require("./cart.api");

//*** 라우터 경로 설정 ***//
router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/product", productApi);
router.use("/cart", cartApi);

module.exports = router;
