import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

console.log("ENV here>>>",import.meta.env.VITE_BACKEND_URL);


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  // Initialize token from localStorage
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // Fetch logged-in user's details
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        setUser(null);
        setIsOwner(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      setIsOwner(null);
      toast.error(
        err.response?.data?.message || err.message
      );
    }
  };

  // Fetch all available cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");

      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      toast.error(
        err.response?.data?.message || err.message
      );
    }
  };

  // Fetch cars when the provider mounts
  useEffect(() => {
    fetchCars();
  }, [user]);

  // Update authentication whenever the token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      fetchUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsOwner(null);
    }
  }, [token]);

  // Log out the user
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];

    setToken(null);
    setUser(null);
    setIsOwner(null);
    setCars([]);

    toast.success("You've been logged out!");
    navigate("/");
  };

  const value = {
    axios,
    navigate,
    currency,
    token,
    setToken,
    user,
    setUser,
    cars,
    setCars,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    fetchCars,
    fetchUser,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
