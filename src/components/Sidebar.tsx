// import { useState } from "react";
// import { BiMenu, BiX } from "react-icons/bi";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import Logo from "../../public/images/sumaLogo.png";
// import { logout } from "../store/slices/authSlice";
// import { useDispatch } from "react-redux";

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const menuItems = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Initiate Call", path: "/call" },
//     { label: "Add Prompt", path: "/add-prompt" },
//   ];

//   const handleNavigate = () => {
//     navigate("/");
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="flex">
//       {/* ✅ Mobile Menu Button */}
//       <button
//         className="lg:hidden fixed top-1 left-1 z-50 p-2 rounded-md"
//         onClick={() => setOpen(true)}
//       >
//         <BiMenu size={24} />
//       </button>
//       <div
//         className={`${
//           open ? "translate-x-0" : "-translate-x-full"
//         } fixed lg:static top-0 left-0 min-h-[100vh] w-64 bg-white text-black transform lg:translate-x-0 transition-transform duration-300 z-50`}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-black">
//           <img
//             src={Logo}
//             width={150}
//             onClick={handleNavigate}
//             className="cursor-pointer"
//           />
//           <button
//             className="lg:hidden text-black"
//             onClick={() => setOpen(false)}
//           >
//             <BiX size={24} />
//           </button>
//         </div>

//         <nav className="flex flex-col gap-1 pt-4 pl-1 relative">
//           {menuItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`px-3 py-2 rounded relative transition-colors duration-200 pl-5 ${
//                   isActive
//                     ? // ? "bg-blue-100 text-[#3F3EED] font-semibold"
//                       "bg-blue-100 text-blue-900 font-semibold"
//                     : "text-black hover:bg-blue-100"
//                 }`}
//                 onClick={() => setOpen(false)}
//               >
//                 {isActive && (
//                   <div className="absolute left-0 top-0 w-1 h-full bg-blue-900 rounded-r"></div>
//                 )}
//                 {item.label}
//               </Link>
//             );
//           })}
//           <button
//             onClick={handleLogout}
//             className="px-3 py-2 rounded text-left text-black hover:bg-blue-100 pl-5 cursor-pointer"
//           >
//             Logout
//           </button>
//         </nav>
//       </div>

//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../public/images/sumaLogo.png";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Initiate Call", path: "/call" },
    { label: "Add Prompt", path: "/add-prompt" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigateHome = () => navigate("/");

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleNavigateHome}
        >
          <img src={Logo} alt="Logo" className="h-8" />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-900 font-semibold border-b-2 border-blue-900 pb-1"
                    : "text-gray-700 hover:text-blue-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 hover:text-red-600 transition"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-800"
          onClick={() => setMenuOpen(true)}
        >
          <BiMenu />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-5 right-5 text-3xl text-gray-700"
          onClick={() => setMenuOpen(false)}
        >
          <BiX />
        </button>

        <div className="flex flex-col items-center mt-20 space-y-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium ${
                  isActive ? "text-blue-900 font-semibold" : "text-gray-800"
                } hover:text-blue-900 transition`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="mt-4 text-lg font-medium text-gray-800 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
