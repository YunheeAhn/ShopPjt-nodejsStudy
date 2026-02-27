//따로 분리 된 /order 라우터 파일

// express 모듈 불러오기
const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const orderController = require("../controller/order.controller");

// 오더 생성하기 endpoint 연결
router.post("/", authController.authenticate, orderController.createOrder);

// 내 주문 목록 (로그인 유저) endpoint 연결
router.get("/me", authController.authenticate, orderController.getMyOrders);

// 내 주문 상세 (로그인 유저) endpoint 연결
router.get("/me/:id", authController.authenticate, orderController.getMyOrderDetail);

// 주문 목록 endpoint 연결
router.get(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.getOrderList,
);

// 주문 상세 endpoint 연결
router.get(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.getOrderDetail,
);

// 주문 상태 변경 endpoint 연결
router.put(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.updateOrder,
);

// 라우터 모듈 내보내기
module.exports = router;
