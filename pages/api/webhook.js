//acct_1NveHMSBUCXhg3G1

//whsec_a6975ddf681fbd5fa58b22768e565c8e354aa16d5736d1adcd57d599cabdcd73

import { initMongoose } from "../../lib/mongoose";
import { buffer } from "micro";
import Order from "./../../models/Orders";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await initMongoose();
  const signingSecret = process.env.SIGNING_SECRET;

  const payload = await buffer(req);

  const signature = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    signingSecret
  );

  console.log(event);
  if (event?.type === "checkout.session.completed") {
    const metadata = event.data?.object?.metadata;
    const paymentStatus = event.data?.object?.payment_status;

    // if (paymentStatus === "paid") {
    if (metadata?.orderId && paymentStatus === "paid") {
      await Order.findByIdAndUpdate(metadata.orderId, { paid: 1 });
    }
  }

  res.json("ok");
}

export const config = {
  api: {
    bodyParser: false,
  },
};
