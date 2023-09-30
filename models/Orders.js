import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    products: Object,
    email: String,
    name: String,
    address: String,
    city: String,
    paid: { type: Number, defaultValue: 0 },
  },
  { timestamps: true }
);

const Order = models?.Order || model("Order", OrderSchema);

export default Order;
