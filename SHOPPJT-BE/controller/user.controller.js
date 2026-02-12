// user 기능 정의

// model 불러오기
const User = require("../models/User");

// bcryptjs 모듈 불러오기 (비밀번호 암호화)
const bcrypt = require("bcryptjs");

// http 응답 규칙
// 200 : 성공
// 400 : 클라이언트 요청 오류
// 500 : 서버 내부 오류

// userController 객체 생성
const userController = {};

// 회원가입 유저 생성
userController.createUser = async (req, res) => {
  try {
    const { name, email, password, level } = req.body;

    // 이미 존재하는 이메일인지 확인
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new Error("이미 가입한 이메일 입니다");
    }

    // 비밀번호 암호화
    const salt = bcrypt.genSaltSync(11);
    const hash = bcrypt.hashSync(password, salt);

    // 새로운 유저 생성
    const newUser = new User({
      name,
      email,
      password: hash, // 암호화된 비밀번호 저장
      level: level ? level : "customer",
    });

    // 데이터베이스에 유저 저장
    await newUser.save();

    // 성공 응답
    res.status(200).json({ status: "success", message: "회원가입에 성공 했습니다" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;
