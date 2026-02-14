// User 관련 데이터베이스 스키마

//*** mongoose 세팅 ***//
const mongoose = require("mongoose");

// jsonwebtoken 모듈 불러오기
const jwt = require("jsonwebtoken");

// env 파일 불러오기
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    level: {
      // 유저 권한 관리
      // customer, admin
      type: String,
      required: true,
      default: "customer", // 기본은 customer
    },
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updateAt;
  delete obj.createAt;

  return obj;
};

// 인증 토큰 생성 메서드
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, { expiresIn: "1d" });
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
