// login 기능 정의

// model 불러오기
const User = require("../models/User");

// jsonwebtoken 모듈 불러오기
const jwt = require("jsonwebtoken");

// env 파일 불러오기
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// bcryptjs 모듈 불러오기 (비밀번호 암호화)
const bcrypt = require("bcryptjs");

const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginUser = await User.findOne({ email });
    if (loginUser) {
      // 유저가 있는 경우
      const isMatch = await bcrypt.compare(password, loginUser.password);

      if (isMatch) {
        // bcrypt password 와 user.password가 일치하는 경우
        // 토큰 생성
        const token = await loginUser.generateAuthToken();
        return res.status(200).json({ status: "success", loginUser, token });
      }
    }
    // 유저가 없는 경우
    throw new Error("유효하지 않은 이메일 또는 비밀번호 입니다");
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// valid 한 토큰인지 확인
authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      // 토큰이 없는 경우
      throw new Error("토큰이 유효하지 않거나, 없습니다");
    }
    // 토큰이 있다면 'Bearer '제거 하기
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error("토큰이 유효하지 않거나, 없습니다");
      }
      req.userId = payload._id;
      next();
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = authController;
