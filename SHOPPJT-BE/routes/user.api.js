//따로 분리 된 /user 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");

// 회원가입 endpoint 연결
router.post("/", userController.createUser);

// 토큰값 받아서 로그인 endpoint 연결
// get 인 이유 : 토큰을 headers에 넣어서 보내줌
// authenticate : valid 한 토큰인지 확인
// getUser : valid 토큰을 갖고 있는 유저 확인
router.get("/me", authController.authenticate, userController.getUser);

// 라우터 모듈 내보내기
module.exports = router;
