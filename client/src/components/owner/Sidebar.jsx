import React, { useState } from "react";
import { assets, dummyUserData, ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const {user,axios,fetchUser} = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState("");

  const updateImage = async () => {
    try{
      const formData = new FormData();
      formData.append('image',image);
      const {data} = await axios.post('/api/owner/update-image',formData);
      if(data.success){
        fetchUser();
        toast.success(data.message);
        setImage('')
      }
      else{
        toast.error(data.message);
      }
    }catch(err){
        toast.error(err.message);
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "https://unsplash.com/photos/a-man-with-a-beard-and-a-mustache-2hx9U1HrgZM"
            }
            alt="profile"
            className="rounded-full h-9 w-9 md:w-15 md:h-15 mx-auto"
          />
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} alt="edit" />
          </div>
        </label>
      </div>
      {image && (
        <button className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer" onClick={updateImage}>
          Save <img src={assets.check_icon} width={13} />
        </button>
      )}
      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      <div className="w-full flex flex-col gap-2 bg-white">
        {ownerMenuLinks.map((link, index) => {
          return <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? "bg-primary/10 text-primary" : "text-gray-500"}`}>
            <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="" />
            <span>{link.name}</span>
          </NavLink>;
        })}
      </div>
    </div>
  );
};

export default Sidebar;
