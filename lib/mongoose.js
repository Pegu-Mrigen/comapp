// import mongoose from "mongoose";
// export async function initMongoose() {
//   if (mongoose.connection.readyState === 1) {
//     return mongoose.connection.asPromise();
//   }
//   return await mongoose
//     .connect(process.env.MONGODB_URL)
//     .then(console.log("first"));
// }
import mongoose from "mongoose";

export async function initMongoose() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  return await mongoose.connect(process.env.MONGODB_URL);
}