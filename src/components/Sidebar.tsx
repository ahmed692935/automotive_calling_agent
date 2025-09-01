// src/components/Sidebar.tsx
import { useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/images/sumaLogo.png";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Initiate Call", path: "/call" },
    // { label: "Logout", path: "/calling" },
  ];

  const handleLogout = () => {
    // clear redux state
    dispatch(logout());

    // clear localStorage (if you’re saving auth info there)
    localStorage.removeItem("user");

    // redirect
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Mobile Header */}
      <div className="lg:hidden justify-between w-full p-4">
        {/* <h1 className="text-xl font-bold">App Name</h1> */}
        <button onClick={() => setOpen(true)}>
          <BiMenu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
          // } fixed lg:static top-0 left-0 min-h-[100vh] w-64 bg-gradient-to-b from-[#6d0f78] to-[#0a0f2d] text-white transform lg:translate-x-0 transition-transform duration-300 z-50`}
        } fixed lg:static top-0 left-0 min-h-[100vh] w-64 bg-white text-white transform lg:translate-x-0 transition-transform duration-300 z-50`}
      >
        {/* Sidebar Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-black">
          {/* <span className="text-2xl font-bold">Sidebar</span> */}
          <img src={Logo} width={150} />
          {/* Close button only on mobile */}
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <BiX size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-3 py-2 rounded hover:bg-purple-300 text-black"
              onClick={() => setOpen(false)} // close sidebar on mobile after click
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded text-left text-black hover:bg-purple-300"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
