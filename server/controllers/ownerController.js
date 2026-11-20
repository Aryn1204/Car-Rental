import imageKit from "../config/imageKit.js";
import { User } from "../models/User.js";
import { Car } from "../models/Car.js";
import fs from "fs";
import { Booking } from "../models/Booking.js";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findOneAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "User role updated" });
  } catch (err) {
    res.status(409).json({ success: false, message: err.message });
  }
};

//API to list car
export const addCar = async (req, res) => {
  try {
    
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    console.log("CAR LOCATION>>",car); 
    const imageFile = req.file;

    // Upload Image to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const base64Image = fileBuffer.toString("base64");
    const response = await imageKit.files.upload({
      file: base64Image,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const imageURL = response.url;
    const image = imageURL;
    await Car.create({ ...car, owner: _id, image });

    res.status(200).json({ success: true, message: "Car Added" });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//Get owner cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    
    res.json({ success: true, cars });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

//Toggle car availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (car.owner.toString() !== _id.toString()) {
      return res.status(409).json({ success: false, message: "Unauthorized" });
    }
    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability toggled" });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

//API to delete Car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const carId = req.body;
    const currentCar = await Car.findById(carId);

    if (currentCar.owner.toString() !== _id.toString()) {
      return res.status(409).json({ success: false, message: "Unauthorized" });
    }

    currentCar.owner = null;
    currentCar.isAvailabe = false;
    await currentCar.save();

    return res.status(200).json({ success: true, message: "Car deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//API to list all user expenses
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    
    if (role !== "owner") {
      return res.status(409).json({ success: false, message: "Unauthorized" });
    }
    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    //Calculate monthly revenue from bookings where status is confirmed

    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    return res.json({ success: true, dashboardData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

//API to update user image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;
    //Upload Image to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const base64Image = fileBuffer.toString("base64");
    const response = await imageKit.files.upload({
      file: base64Image,
      fileName: imageFile.originalname,
      folder: "/users",
    });  
    const imageURL = response.url;
    const image = imageURL;
    await User.findByIdAndUpdate(_id, { image });
    res
      .status(200)
      .json({ success: true, message: "Profile picture updated!!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
