import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets.js";
import CarCard from "../components/CarCard.jsx";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Cars = () => {
  //Getting search params from URL
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState("");

  const isSearchedData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);

  const applyFilter = async () => {
    if (input.trim() === "") {
      setFilteredCars(cars);
      return;
    }
    const search = input.toLowerCase();
    const filtered = cars.filter((car) => {
      return (
        car.brand.toLowerCase().includes(search) ||
        car.transmission.toLowerCase().includes(search) ||
        car.category.toLowerCase().includes(search) ||
        car.model.toLowerCase().includes(search)
      );
    });

    setFilteredCars(filtered);
  };
  const searchAvailability = async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        setFilteredCars(data.availableCars);
        if (data.availableCars.length === 0) {
          toast("No available cars");
        }
        return null;
      }
    } catch (err) {}
  };

  useEffect(() => {
    isSearchedData && searchAvailability();
  }, []);

  useEffect(() => {
    cars.length > 0 && !isSearchedData && applyFilter();
  }, [input, cars]);

  return (
    <div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center w-full bg-light py-20 max-md:px-4"
      >
        <Title
          title="Available Cars"
          subtitle="Browse a selection of premium vehicles"
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between rounded-full mt-6 bg-white w-full max-w-140 h-12 px-4 shadow"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4.5 h-4.5 mr-2"
          />
          <input
            onChange={(e) => {
              setInput(e.target.value);
            }}
            value={input}
            type="text"
            placeholder="Search by make,model or features.."
            className="text-gray-500 outline-none w-full h-full"
          />
          <img
            src={assets.filter_icon}
            alt="search"
            className="w-4.5 h-4.5 mr-2"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
      >
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length}{" "}
          {filteredCars.length == 1 ? "car" : "cars"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => {
            return (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={index}
              >
                <CarCard car={car} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Cars;
