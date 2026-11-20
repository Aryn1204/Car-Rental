import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Banner = () => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col lg:flex-row lg:items-end items-center justify-between px-6 sm:px-10 lg:pl-14 pt-10 lg:pt-14 bg-linear-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-4 sm:mx-6 md:mx-auto rounded-3xl overflow-hidden shadow-lg gap-8 lg:gap-4"
    >
      <div className="text-white text-center lg:text-left flex flex-col items-center lg:items-start max-w-xl pb-2 lg:pb-14">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Do you own a luxury car?
        </h2>
        <p className="mt-2 text-sm sm:text-base font-medium opacity-90">
          Monetize your car by listing your car.
        </p>
        <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed max-w-md">
          We take care of insurance, driver verification and payments, so you
          can earn passive income.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-white hover:bg-slate-100 active:scale-95 transition-all text-primary font-medium rounded-xl text-sm mt-6 cursor-pointer shadow-sm"
        >
          List your car
        </motion.button>
      </div>

      <motion.img
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        src={assets.banner_car_image}
        alt="car"
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl object-contain lg:mt-0 mt-2 self-center lg:self-end"
      />
    </motion.div>
  );
};

export default Banner;
