// User 관련 데이터베이스 스키마

//*** mongoose 세팅 ***//
const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);
module.exports = User;
