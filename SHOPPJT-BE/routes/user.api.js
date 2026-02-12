//따로 분리 된 /user 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");

// 회원가입 endpoint 연결
router.post("/", userController.createUser);

// 라우터 모듈 내보내기
module.exports = router;
