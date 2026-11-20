import { useEffect, useState } from "react";
import { assets, dummyDashboardData } from "../../assets/assets.js";
import Title from "../../components/owner/Title.jsx";
import { useAppContext } from "../../context/AppContext.jsx";

const Dashboard = () => {

  const {isOwner,axios, currency} = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.carIconColored,
    },
    {
      title: "Pending Bookings",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Completed Bookings",
      value: data.completedBookings,
      icon: assets.carIconColored,
    },
  ];

  const fetchDashboardData = async ()=>{
    try{
      const {data} = await axios.get('/api/owner/dashboard');
      if(data.success){
        setData(data.dashboardData);
      }else{
        toast.error(data.message);
      }
    }catch(err){
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if(isOwner){
      fetchDashboardData();
    }
  }, [isOwner]);


  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Header Section */}
      <Title
        title="Admin Dashboard"
        subtitle="Monitor overall performance including total cars, bookings, revenue, and recent activities."
      />

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-gray-200 bg-white rounded-xl p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">
                {card.title}
              </p>
              <p className="text-2xl font-semibold tracking-tight text-gray-900">
                {card.value}
              </p>
            </div>
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50/80 text-blue-600 p-2 border border-blue-100/50">
              <img src={card.icon} alt="" className="w-5 h-5 object-contain" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 w-full items-start">
        {/* Recent Bookings (Spans 2 columns for a balanced wide view) */}
        <div className="lg:col-span-2 p-5 md:p-6 border border-gray-200 bg-white rounded-xl shadow-sm flex flex-col">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Recent Bookings
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Latest Customer Bookings
            </p>
          </div>

          <div className="mt-5 divide-y divide-gray-100 max-h-100 overflow-y-auto pr-1">
            {data.recentBookings.map((booking, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                    <img
                      src={assets.listIconColored}
                      className="h-4 w-4 object-contain"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {booking.car.brand} {booking.car.model}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {booking.createdAt.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold text-gray-900">
                    {currency}
                    {booking.price.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrated Minimal Monthly Revenue Card (Spans 1 column) */}
        <div className="lg:col-span-1 p-5 border border-borderColor rounded-xl shadow-sm bg-white">
          <h1 className="text-xs font-medium uppercase tracking-wider opacity-60">
            Monthly Revenue
          </h1>
          <p className="text-2xl font-semibold tracking-tight text-primary mt-2">
            {currency}
            {data.monthlyRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
