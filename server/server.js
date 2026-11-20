import express from "express";
import cors from "cors";
import { connectToMongo } from "./config/mongoDB.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

//Initialize the app
const app = express();
await connectToMongo();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors());
app.use(express.json());

//Health Check
app.get("/", (req, res) => {
  res.send("Server running");
});

//User routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

//Listner function
app.listen(PORT,  '0.0.0.0',() => {
  console.log(`The server is running on ${PORT}`);
});
