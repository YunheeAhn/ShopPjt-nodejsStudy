// 라우터 정의

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const userApi = require("./user.api");
const authApi = require("./auth.api");

//*** 라우터 경로 설정 ***//
router.use("/user", userApi);
router.use("/auth", authApi);

module.exports = router;
