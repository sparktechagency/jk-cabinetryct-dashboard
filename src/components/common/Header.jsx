/* eslint-disable react/prop-types */
import { Dropdown, Badge } from "antd";
import { BiMessageRoundedDots } from "react-icons/bi";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetLoggedUserQuery } from "../../redux/features/profile/profileApi";
import { imageBaseUrl } from "../../utils/imageBaseUrl";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { data: mySelf } = useGetLoggedUserQuery();
  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        Swal.fire({
          title: "Logged Out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/auth/login");
      }
    });
  };

  // Ant Design v5 Menu Items
  const menuItems = [
    {
      key: "1",
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: "3",
      label: (
        <span
          onClick={handleLogOut}
          style={{ cursor: "pointer", display: "block" }}
        >
          Logout
        </span>
      ),
    },
  ];

  return (
    <div className="flex justify-between items-center shadow p-3 sm:p-4 bg-white">
      {/* Left: Hamburger + Welcome */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Welcome Section */}
        <div className="space-y-0.5">
          <h1 className="text-lg sm:text-xl lg:text-2xl text-primary font-medium">
            Welcome!
          </h1>
          <h2 className="text-xs sm:text-sm lg:text-base font-medium text-gray-700 hidden sm:block">
            {mySelf?.data?.firstName || mySelf?.data?.lastName
              ? `${mySelf?.data?.firstName} ${mySelf?.data?.lastName}`
              : "Admin"}
          </h2>
        </div>
      </div>

      {/* Right: Actions - Message + Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Message Icon */}
        <div className="relative">
          <button
            onClick={() => navigate("/inbox")}
            className="relative p-2 sm:p-3 text-white bg-primary rounded-full hover:bg-red-700 transition-colors"
          >
            <BiMessageRoundedDots className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Profile Dropdown */}
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          arrow
          trigger={["click"]}
        >
          <img
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full object-cover cursor-pointer border-2 border-gray-200 hover:border-primary transition-colors"
            src={
              mySelf?.data?.profileImage
                ? `${imageBaseUrl}${mySelf.data.profileImage}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            onError={(e) => {
              e.target.src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
