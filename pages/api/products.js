// import { initMongoose } from "../../lib/mongoose";
// import Product from "../../models/Product";

// export default async function handle(req, res) {
//   await initMongoose();

//   res.json(await Product.find().exec());
// }

//TO RESUSE findAllProducts FUNCTION
import { initMongoose } from "../../lib/mongoose";
import Product from "../../models/Product";

export async function findAllProducts() {
  return Product.find().exec();
}

export default async function handle(req, res) {
  await initMongoose();

  const { ids } = req.query;
  if (ids) {
    const idsArray = ids.split(",");
    res.json(
      await Product.find({
        _id: { $in: idsArray },
      }).exec()
    );
  } else {
    res.json(await findAllProducts());
  }
}
