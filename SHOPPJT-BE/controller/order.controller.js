// order 기능 정의

// model 불러오기
const Order = require("../models/Order");
const productController = require("./product.controller");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const orderController = {};

// 오더 생성하기
orderController.createOrder = async (req, res) => {
  try {
    // userId, totalPrice, shipTo, contact, orderList 받아오기
    const { userId } = req;
    const { totalPrice, shipTo, contact, orderList } = req.body;

    // 재고 확인, 재고 업데이트
    const insufficientStockItems = await productController.checkItemListStock(orderList);

    // 재고 충분하지 않는 아이템이 있는 경우?
    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems
        .reduce((total, item) => total + item.message + "\n", "")
        .trim();
      throw new Error(errorMessage);
    }

    // 새로운 오더 생성하기
    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      item: orderList,
      orderNum: randomStringGenerator(),
    });

    // 새로운 오더 저장하기
    await newOrder.save();

    // 카트 비우기

    // status 보내기
    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
