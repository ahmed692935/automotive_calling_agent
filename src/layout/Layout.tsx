import Sidebar from "../components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex !w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="w-[92%] p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default Layout;

// import Sidebar from "../components/Sidebar";
// interface LayoutProps {
//   children: React.ReactNode;
// }
// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   return (
//     <div className="flex min-h-screen">
//       {" "}
//       {/* Sidebar */} <Sidebar /> {/* Main content */}{" "}
//       <main className="w-full p-6 bg-gray-100">{children}</main>{" "}
//     </div>
//   );
// };
// export default Layout;
