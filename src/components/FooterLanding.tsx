// function FooterLanding() {
//   const footerLinks = {
//     Company: [
//       { label: "Home", href: "/" },
//       // { label: "About Us", href: "#" },
//       { label: "Contact Us", href: "#" },
//       // { label: "Privacy Policy", href: "#" },
//       { label: "Terms of Use", href: "#" },
//     ],
//     // "Agentic AI": [
//     //   { label: "AI Contact Center", href: "#" },
//     //   { label: "AI Sales", href: "#" },
//     //   { label: "AI Communication", href: "#" },
//     // ],
//     "Solutions by Industries": [
//       { label: "Insurance", href: "#" },
//       { label: "Education", href: "#" },
//       { label: "Healthcare", href: "#" },
//       { label: "Real Estate", href: "#" },
//       { label: "Recruiting", href: "#" },
//       { label: "Technology", href: "#" },
//       //   { label: "Professional Services", href: "#" },
//       //   { label: "Retail", href: "#" },
//       //   { label: "Automotive", href: "#" },
//     ],
//     // Resources: [
//     //   { label: "Partnership", href: "#" },
//     //   { label: "Comparison", href: "#" },
//     //   { label: "Enterprise Solution", href: "#" },
//     // ],
//     "Contact Us": [{ label: "test@gmail.com", href: "#" }],
//   };

//   //   const socialLinks = [
//   //     { href: "#", icon: "lucide-facebook" },
//   //     { href: "#", icon: "lucide-linkedin" },
//   //     { href: "#", icon: "lucide-twitter" },
//   //     { href: "#", icon: "lucide-instagram" },
//   //   ];

//   return (
//     <>
//       <footer className="text-gray-700 py-10 mt-10 w-full bg-gradient-to-b from-[#382b86] to-[#00021D]">
//         <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Logo */}
//           <div className="flex justify-center md:justify-start mb-8">
//             <a href="/" className="text-2xl text-white font-bold">
//               Paul.<span className="font-semibold text-white">Calling</span>
//             </a>
//           </div>

//           {/* Footer Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
//             {Object.entries(footerLinks).map(([section, links]) => (
//               <div key={section}>
//                 <h3 className="font-semibold mb-4 text-white">{section}</h3>

//                 {section !== "Contact Us" ? (
//                   <ul className="space-y-2">
//                     {links.map(({ label, href }) => (
//                       <li key={label}>
//                         <a
//                           href={href}
//                           className="text-xs text-white hover:text-blue-500 transition-colors"
//                         >
//                           {label}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="flex flex-col items-center md:items-start space-y-3">
//                     <a
//                       href={links[0].href}
//                       className="text-sm text-white hover:text-blue-500 transition-colors"
//                     >
//                       {links[0].label}
//                     </a>
//                     {/* Social Icons */}
//                     {/* <div className="flex justify-center md:justify-start space-x-4 mt-2">
//                       {socialLinks.map(({ href, icon }) => (
//                         <a
//                           key={href}
//                           href={href}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-white transition-colors"
//                         >
//                           <i className={`lucide ${icon}`} />
//                         </a>
//                       ))}
//                     </div> */}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Bottom */}
//           <div className="border-t border-gray-200 mt-10 pt-6">
//             <p className="text-center text-sm text-white">
//               ©{new Date().getFullYear()} | All rights reserved by Suma.ai
//             </p>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// }

// export default FooterLanding;

// import SumaWhite from "../../public/images/SumaWhite.jpeg";

function FooterLanding() {
  const footerLinks = {
    Company: [
      { label: "Home", href: "/" },
      { label: "Contact Us", href: "#contact" },
      { label: "Terms of Use", href: "#use" },
    ],
    "Solutions by Industries": [
      { label: "Insurance", href: "#about" },
      { label: "Education", href: "#about" },
      { label: "Healthcare", href: "#about" },
      { label: "Real Estate", href: "#about" },
      { label: "Recruiting", href: "#about" },
      { label: "Technology", href: "#about" },
    ],
    "Contact Us": [{ label: "pia@bysuma.com", href: "#" }],
  };

  return (
    <footer className="text-gray-700 py-10 mt-10 w-full bg-gradient-to-b from-[#382b86] to-[#00021D]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* 1️⃣ Logo + Description */}
          <div>
            <a
              href="/"
              className="text-2xl text-white font-bold mb-3 inline-block"
            >
              Suma.<span className="font-semibold text-white">ai</span>
              {/* <img
                src={SumaWhite}
                alt="Paul Logo"
                className="h-6 sm:h-8 transition-transform duration-200"
              /> */}
            </a>
            <p className="text-xs text-white mt-2">
              Suma.ai helps you automate your calls, improve conversations, and
              save time with AI-powered calling solutions.
            </p>
          </div>

          {/* 2️⃣ Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              {footerLinks.Company.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-xs text-white hover:text-blue-500 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3️⃣ Solutions by Industries */}
          <div>
            <h3 className="font-semibold mb-4 text-white">
              Solutions by Industries
            </h3>
            <ul className="space-y-2">
              {footerLinks["Solutions by Industries"].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-xs text-white hover:text-blue-500 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4️⃣ Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <a
              href={`mailto:${footerLinks["Contact Us"][0].label}`}
              className="text-sm text-white hover:text-blue-500 transition-colors"
            >
              <span className="text-blue-500">Email us:</span>{" "}
              {footerLinks["Contact Us"][0].label}
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-10 pt-6">
          <p className="text-center text-sm text-white">
            ©{new Date().getFullYear()} | All rights reserved by Suma.ai
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterLanding;
