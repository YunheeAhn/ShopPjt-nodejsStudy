// Order 관련 데이터베이스 스키마

//*** mongoose 세팅 ***//
const mongoose = require("mongoose");

const User = require("./User");
const Product = require("./Product");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },
    status: {
      type: String,
      default: "preparing",
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shipTo: {
      type: Object,
      required: true,
    },
    contact: {
      type: Object,
      required: true,
    },
    orderNum: {
      type: String,
    },
    items: [
      {
        productId: {
          type: mongoose.ObjectId,
          ref: Product,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          default: 1,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  delete obj.createAt;

  return obj;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
