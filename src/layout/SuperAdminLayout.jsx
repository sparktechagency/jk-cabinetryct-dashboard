import { Outlet } from "react-router-dom";
import SuperAdminNav from "../components/superAdmin/SuperAdminNav";

const SuperAdminLayout = () => {
  return (
    <section className="w-full min-h-screen bg-gray-50">
      <SuperAdminNav />
      <div className="w-full p-3 sm:p-5 lg:p-6">
        <Outlet />
      </div>
    </section>
  );
};

export default SuperAdminLayout;
