import mongoose from "mongoose";

export const connectToMongo = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/car-rental`);
    console.log("Connected to mongo db");
  } catch (err) {
    console.log(err);
  }
};
