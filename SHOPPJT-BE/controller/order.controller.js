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

    const items = await Promise.all(
      orderList.map(async (it) => {
        if (typeof it.price === "number") {
          return {
            productId: it.productId,
            price: it.price,
            qty: it.qty,
            size: it.size,
          };
        }

        const product = await Product.findById(it.productId);
        if (!product) throw new Error("상품을 찾을 수 없습니다");

        return {
          productId: it.productId,
          price: product.price,
          qty: it.qty,
          size: it.size,
        };
      }),
    );

    // 새로운 오더 생성하기
    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: items,
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

// 전체 주문 목록 (admin) - page + 검색(orderNum)
orderController.getOrderList = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const orderNum = req.query.orderNum || "";
    const PAGE_SIZE = Number(req.query.pageSize || 10);

    const cond = orderNum ? { orderNum: { $regex: orderNum, $options: "i" } } : {};

    const totalItemNum = await Order.countDocuments(cond);
    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

    const list = await Order.find(cond)
      .populate("userId")
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .exec();

    return res.status(200).json({
      status: "success",
      data: list,
      totalItemNum,
      totalPageNum,
      page,
      pageSize: PAGE_SIZE,
    });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 주문 상세 가져오기 + populate
orderController.getOrderDetail = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findById(id).populate("userId").populate("items.productId").exec();

    if (!order) throw new Error("주문을 찾을 수 없습니다");

    return res.status(200).json({ status: "success", data: order });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 주문 상태 변경 (admin)
orderController.updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate({ _id: id }, { status }, { new: true })
      .populate("userId")
      .populate("items.productId");

    if (!updated) throw new Error("주문을 찾을 수 없습니다");

    return res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 로그인한 유저 기준
// 내 주문목록 가져오기
orderController.getMyOrders = async (req, res) => {
  try {
    const { userId } = req;

    const list = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({ status: "success", data: list });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 내 주문 목록 상세 가져오기
orderController.getMyOrderDetail = async (req, res) => {
  try {
    const { userId } = req;
    const id = req.params.id;

    const order = await Order.findOne({ _id: id, userId }).populate("items.productId").exec();

    if (!order) throw new Error("주문을 찾을 수 없습니다");

    return res.status(200).json({ status: "success", data: order });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
