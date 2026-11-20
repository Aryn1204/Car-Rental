import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Hero = () => {
  const [pickUpLocation, setPickUpLocation] = useState("");

  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      "/cars?pickupLocation=" +
        pickUpLocation +
        "&pickupDate=" +
        pickupDate +
        "&returnDate=" +
        returnDate,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-start gap-12 md:gap-16 bg-light text-center p-4 py-12 md:p-8 overflow-hidden"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-4"
      >
        Luxury Vehicles on Rent
      </motion.h1>
      <motion.form
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        action=""
        className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between p-6 rounded-2xl lg:rounded-full w-full max-w-md lg:max-w-5xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] gap-6 lg:gap-4 z-10"
      >
        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-start sm:items-center justify-between w-full gap-6 sm:gap-8 lg:ml-8">
          <div className="flex flex-col items-start gap-1 w-full sm:w-auto flex-1">
            <select
              required
              value={pickUpLocation}
              onChange={(e) => setPickUpLocation(e.target.value)}
              className="w-full bg-transparent font-medium border-b border-gray-200 pb-1 focus:outline-none"
            >
              <option value="" disabled>
                {" "}
                Pickup Location{" "}
              </option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {" "}
                  {city}{" "}
                </option>
              ))}
            </select>
            <p className="px-1 text-xs text-gray-500 hidden sm:block">
              {pickUpLocation ? pickUpLocation : `Please Select Location`}
            </p>
          </div>

          <div className="flex flex-col items-start gap-1 w-full sm:w-auto flex-1">
            <label
              htmlFor="pickup-date"
              className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              Pick-Up Date
            </label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-600 w-full focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col items-start gap-1 w-full sm:w-auto flex-1">
            <label
              htmlFor="return-date"
              className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              Return Date
            </label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              className="text-sm text-gray-600 w-full focus:outline-none"
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dull text-white rounded-xl lg:rounded-full cursor-pointer font-medium shadow-md transition-all w-full lg:w-auto whitespace-nowrap"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="brightness-300 w-4 h-4"
          />
          Search
        </motion.button>
      </motion.form>

      <div className="w-full max-w-5xl md:max-w-6xl lg:max-w-7xl xl:max-w-8xl mt-4 flex justify-center items-center">
        <motion.img
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          src={assets.main_car}
          alt="car"
          className="w-full h-auto object-contain scale-105 sm:scale-110 md:scale-115 transition-transform duration-500"
        />
      </div>
    </motion.div>
  );
};

export default Hero;
