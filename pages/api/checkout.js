import { initMongoose } from "../../lib/mongoose";
import Order from "../../models/Orders";
import Product from "./../../models/Product";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await initMongoose();

  if (req.method !== "POST") {
    res.send("should be a POST req!");
    return;
  }

  const { email, name, address, city } = req.body;

  const productsIds = req.body.products.split(",");

  const uniqIds = [...new Set(productsIds)];
  const products = await Product.find({ _id: { $in: uniqIds } }).exec();

  //res.json(products);

  let line_items = [];

  for (let productId of uniqIds) {
    const quantity = productsIds.filter((id) => id === productId).length;

    const product = products.find((p) => p._id.toString() === productId);

    line_items.push({
      quantity,
      price_data: {
        currency: "INR",
        product_data: { name: product.name },
        unit_amount: product.price * 100,
      },
    });
  }
  const order = await Order.create({
    products: line_items,
    email,
    name,
    address,
    city,
    paid: 0,
  });

  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: "payment",
    customer_email: email,
    success_url: `${req.headers.origin}/?success=true`,
    cancel_url: `${req.headers.origin}/?canceled=true`,
    metadata: { orderId: order._id.toString() },
  });

  // const url="http://localhost:3000/checkout"    TO WORK ON

  res.redirect(303, session.url);

  //res.json(req.method);
}
