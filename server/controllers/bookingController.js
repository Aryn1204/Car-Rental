import { Booking } from "../models/Booking.js";
import { Car } from "../models/Car.js";

//Function to check availability for a car in a given date
const checkAvailability = async (car, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return bookings.length === 0;
};

//API to check the availability of a car
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    // 1. Get the user's search details
    const { location, pickupDate, returnDate } = req.body;
    // 2. Find all cars at that location
    const cars = await Car.find({
      location,
      isAvaliable: true,
    });
    // 3. Check each car's availability
    const availableCars = [];
    for (const car of cars) {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate,
      );
      // 4. Keep the car only if it's available
      if (isAvailable) {
        availableCars.push({
          ...car._doc,
          isAvailable: true,
        });
      }
    }
    // 5. Send the available cars to the frontend
    res.json({
      success: true,
      availableCars,
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

//API to create booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }
    const carData = await Car.findById(car);
    // Calculate price based on pickupDate and returnDate
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    res.json({ success: true, message: "Booking Created" });
  } catch (err) {
    console.log(err.message);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });
    return res.json({ success: true, bookings });
  } catch (err) {
    console.log(err.message);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

//API to get Owner Bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    console.log(err.message);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

//API to change booking of the car
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;
    const booking = await Booking.findById(bookingId);
    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    booking.status = status;
    await booking.save();
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
