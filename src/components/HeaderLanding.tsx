import { useEffect, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import SumaLogo from "../../public/images/SumaWhite.jpeg";
import SumaBlack from "../../public/images/sumaLogo.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { FaChevronDown, FaRegUserCircle } from "react-icons/fa";
import { logout } from "../store/slices/authSlice";
// import { Menu, X } from "lucide-react";

function HeaderLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const menuItems = ["Home", "About", "Services", "Contact"];

  // Logged In user
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full h-16 sm:h-20 z-50 transition-all duration-300 px-4 md:px-8  ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto w-full h-full flex items-center justify-between">
          {/* Logo */}
          <h3>
            <img
              // src={SumaLogo}
              src={isScrolled ? SumaBlack : SumaLogo}
              alt="Suma Logo"
              className="h-6 sm:h-8 transition-transform duration-200"
            />
          </h3>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item, index) => {
              const id = item.toLowerCase(); // home, about, services, contact
              return (
                <li
                  key={index}
                  onClick={() => handleScrollToSection(id)}
                  className={`list-none cursor-pointer font-semibold transition-colors duration-200 text-base ${
                    isScrolled
                      ? "text-blue-900 hover:text-blue-700"
                      : "text-white hover:text-blue-900"
                  }`}
                >
                  {item}
                </li>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-3">
            {/* IF USER IS LOGGED IN */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer"
                >
                  {/* 5 Characters + ... */}
                  {/* <span className="font-semibold text-[#fff]">
                    {user.email.slice(0, 5)}...
                  </span> */}
                  <span
                    className={`font-semibold ${
                      isScrolled ? "text-[#13243C]" : "text-white"
                    }`}
                  >
                    {user.email.slice(0, 5)}...
                  </span>

                  {/* <FaRegUserCircle className="text-white" size={24} /> */}
                  <FaRegUserCircle
                    className={`${
                      isScrolled ? "text-[#13243C]" : "text-white"
                    }`}
                    size={24}
                  />
                  <FaChevronDown className="text-white" size={12} />
                </button>

                {/* DROPDOWN */}
                {openDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                    {/* FULL EMAIL SHOW */}
                    {/* <div className="px-4 py-2 border-b border-gray-200 text-[#3d4b52]/70">
                      {user.email}
                    </div> */}
                    <div
                      className={`font-semibold ${
                        isScrolled ? "text-[#13243C]" : "text-white"
                      }`}
                    >
                      {user.email}
                    </div>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 text-[#3d4b52]"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => dispatch(logout())}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#3d4b52] cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* IF USER IS NOT LOGGED IN → SHOW SIGNUP + LOGIN */}
                <Link
                  to="/signup"
                  className={`h-9 sm:h-10 px-3 sm:px-5 text-sm sm:text-base rounded-md font-semibold flex items-center justify-center transition-all duration-300
      ${
        isScrolled
          ? "bg-white text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white"
          : "bg-white text-blue-900 hover:bg-blue-900 hover:border-2 border-white hover:text-white"
      }`}
                >
                  Sign Up
                </Link>

                <Link
                  to="/login"
                  className={`h-9 sm:h-10 px-3 sm:px-5 text-sm sm:text-base rounded-md font-semibold flex items-center justify-center transition-all duration-300
      ${
        isScrolled
          ? "bg-white text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white"
          : "bg-white text-blue-900 hover:bg-blue-900 hover:border-2 border-white hover:text-white"
      }`}
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`md:hidden text-3xl focus:outline-none transition-colors duration-300 cursor-pointer ${
              isScrolled ? "text-blue-900" : "text-white"
            }`}
          >
            <BiMenu />
          </button>
        </div>

        {/* Mobile Slide Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 sm:w-2/3 bg-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 left-5 text-3xl text-blue-900 hover:text-blue-700 transition-all cursor-pointer"
          >
            <BiX />
          </button>

          <div className="flex flex-col items-center mt-20 space-y-6">
            {/* Nav Links */}
            <ul className="flex flex-col items-center space-y-3">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleScrollToSection(item.toLowerCase())}
                  className="cursor-pointer text-blue-900 font-semibold text-lg hover:text-blue-700 transition-colors duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex flex-col space-y-3 w-[80%] mt-10">
              {user ? (
                <div className="relative w-full">
                  <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center justify-between w-full px-4 py-2 rounded-md border border-[#13243C] bg-[#13243C] text-white font-semibold cursor-pointer"
                  >
                    <span>{user.email.slice(0, 5)}...</span>
                    <FaChevronDown />
                  </button>

                  {openDropdown && (
                    <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 flex flex-col">
                      <div className="px-4 py-2 border-b text-gray-700">
                        {user.email}
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          dispatch(logout());
                          setMenuOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-left w-full cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800 text-center transition-all"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="bg-white border border-blue-900 text-blue-900 py-2 rounded-md font-semibold hover:bg-blue-900 hover:text-white text-center transition-all"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500"
          ></div>
        )}
      </header>
    </>
  );
}

export default HeaderLanding;
