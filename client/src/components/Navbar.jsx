import { useState } from "react";
import { assets, menuLinks } from "../assets/assets.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { setShowLogin, isOwner, axios, user, setIsOwner, logout } =
    useAppContext();

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-12 lg:px-20 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all w-full z-40 ${
        location.pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      <Link to="/" className="z-50">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-7 sm:h-8 object-contain"
        />
      </Link>
      <div
        className={`max-sm:fixed max-sm:h-[calc(100vh-4rem)] max-sm:w-full max-sm:top-16 max-sm:left-0 max-sm:border-t border-borderColor flex flex-col sm:flex-row items-stretch sm:items-center justify-start sm:justify-end gap-6 sm:gap-8 max-sm:p-6 transition-all duration-300 ease-in-out z-40 ${
          location.pathname === "/"
            ? "max-sm:bg-light bg-transparent"
            : "max-sm:bg-white bg-transparent"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 w-full sm:w-auto">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`font-medium text-base sm:text-sm hover:text-primary transition-colors py-1 w-full sm:w-auto ${
                location.pathname === link.path
                  ? "text-primary font-semibold"
                  : "text-gray-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-4 py-1.5 rounded-full max-w-56 bg-white/50 focus-within:bg-white focus-within:border-primary transition-all">
          <input
            type="text"
            className="w-full bg-transparent outline-none placeholder-gray-400 text-xs"
            placeholder="Search Products"
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4 h-4 opacity-70"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mt-auto sm:mt-0 w-full sm:w-auto">
          <button
            onClick={() => {
              isOwner ? navigate("/owner") : changeRole();
              setOpen(false);
            }}
            className="cursor-pointer text-left sm:text-center font-medium text-base sm:text-sm hover:text-primary transition-colors py-2 sm:py-0"
          >
            {isOwner ? "Dashboard" : "List Cars"}
          </button>
          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
              setOpen(false);
            }}
            className="cursor-pointer px-6 sm:px-8 py-2.5 sm:py-2 bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white font-medium rounded-xl sm:rounded-lg text-sm shadow-sm"
          >
            {user ? `Log Out` : "Log In"}
          </button>
        </div>
      </div>
      <button
        className="sm:hidden cursor-pointer p-1 z-50 focus:outline-none"
        aria-label="Toggle Menu"
        onClick={() => setOpen(!open)}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt="menu toggle"
          className="w-6 h-6 object-contain transition-transform duration-200"
        />
      </button>
    </motion.div>
  );
};

export default Navbar;
