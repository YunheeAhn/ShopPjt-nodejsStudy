//따로 분리 된 /auth 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");

// 계정로그인 endpoint 연결
router.post("/login", authController.loginWithEmail);

// 라우터 모듈 내보내기
module.exports = router;
