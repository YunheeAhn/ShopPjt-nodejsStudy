// cart 기능 정의

// model 불러오기
const Cart = require("../models/Cart");

const cartController = {};

// 카트에 아이템 추가하기
cartController.addItemToCart = async (req, res) => {
  try {
    // 유저 아이디 받아오기
    const { userId } = req;
    // 카트에 담을 정보 가져오기
    const { productId, size, qty } = req.body;

    // 유저의 카트 찾기
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // 만들어진 카트가 없다면 신규로 만들어주기
      cart = new Cart({ userId });
      await cart.save();
    }
    // 카트에 이미 들어있는 아이템인지 확인하기
    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size,
    );
    // 있다면? 에러
    if (existItem) {
      throw new Error("이미 카트에 추가한 제품 입니다");
    }
    // 없다면? 카트에 아이템 추가하기
    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();

    const cartItemQty = cart.items.length;
    res.status(200).json({ status: "success", data: cart, cartItemQty });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 카트 아이템 리스트 불러오기
cartController.getCartList = async (req, res) => {
  try {
    // 유저 아이디 받아오기
    const { userId } = req;
    // 카트 아이템 가져오기
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      // 카트에 아이템이 없다면 기본값 설정하기
      return res.status(200).json({
        status: "success",
        data: [],
        totalPrice: 0,
      });
    }

    // 카트에 아이템이 없다면?
    // 총 수량 계산
    // 총 금액 계산
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.qty;
    }, 0);

    res.status(200).json({
      status: "success",
      data: cart.items,
      totalPrice,
    });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 카트 아이템 삭제하기
cartController.deleteCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.params.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: "fail", error: "카트를 찾을 수 없습니다" });
    }

    const beforeCount = cart.items.length;

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    if (cart.items.length === beforeCount) {
      return res.status(404).json({ status: "fail", error: "삭제할 아이템을 찾을 수 없습니다" });
    }

    await cart.save();

    const cartItemQty = cart.items.length;

    return res.status(200).json({ status: "success", data: cart, cartItemQty });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 카트 아이템 수
cartController.getCartQty = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    const cartItemQty = cart ? cart.items.length : 0;

    return res.status(200).json({ status: "success", cartItemQty });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// 카트 아이템 수량 변경하기
cartController.editCartItem = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const { qty } = req.body;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    if (!cart) throw new Error("There is no cart for this user");
    const index = cart.items.findIndex((item) => item._id.equals(id));
    if (index === -1) throw new Error("Can not find item");
    cart.items[index].qty = qty;
    await cart.save();
    res.status(200).json({ status: 200, data: cart.items });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
