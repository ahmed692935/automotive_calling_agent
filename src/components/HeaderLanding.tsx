import { useEffect, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import SumaLogo from "../../public/images/SumaWhite.jpeg";
import SumaBlack from "../../public/images/sumaLogo.png";
import { Link } from "react-router-dom";
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
      setMenuOpen(false); // close mobile menu if open
    }
  };

  const menuItems = ["Home", "About", "Services", "Contact"];

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full h-16 sm:h-20 z-50 transition-all duration-300 px-4 md:px-8 ${
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
