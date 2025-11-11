// import Sidebar from "../components/Sidebar";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   return (
//     <div className="flex w-full">
//       {/* Fixed Sidebar */}
//       <div className="fixed top-0 left-0 h-screen w-64 z-50 mt-3">
//         <Sidebar />
//       </div>

//       {/* Main Content (scrollable) */}
//       <main className="lg:ml-64 flex-1 min-h-screen overflow-y-auto bg-[#fafafa] p-6">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;

import Navbar from "../components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 bg-[#fafafa] pt-20 px-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
