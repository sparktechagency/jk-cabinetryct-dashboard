import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <section className="w-full flex justify-center items-center  min-h-screen bg-gray-50">
      <Outlet />
    </section>
  );
};

export default AuthLayout;
