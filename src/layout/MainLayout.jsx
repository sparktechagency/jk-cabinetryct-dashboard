import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { initSocket } from "../utils/socket";
import { getToken } from "../utils/authUtils";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Initialize socket connection globally when user is authenticated
  useEffect(() => {
    const token = getToken();
    if (token) {
      initSocket(token);
    }
  }, []);

  return (
    <section className="w-full flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - Desktop: Fixed Left, Mobile: Slide-in */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out overflow-y-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      {/* Main Content Area - Offset for sidebar on desktop */}
      <div className="flex flex-col flex-1 w-full lg:ml-[280px]">
        {/* Header */}
        <div className="sticky top-0 z-30 w-full">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default MainLayout;
