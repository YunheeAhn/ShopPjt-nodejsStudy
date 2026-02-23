// cart 기능 정의

// model 불러오기
const Cart = require("../models/Cart");

const cartController = {};

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

module.exports = cartController;
