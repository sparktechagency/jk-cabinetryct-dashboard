import { Info } from "lucide-react";
import { Dropdown, Avatar } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import { useGetLoggedUserQuery } from "../../redux/features/profile/profileApi";

const SuperAdminNav = () => {
  const { data: user } = useGetLoggedUserQuery();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/super-admin/profile">Profile</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/super-admin/settings">Settings</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <section className="w-full py-3 px-4 sm:py-4 sm:px-6 lg:py-5 bg-[#F9F9F9] shadow-sm">
      <div className="flex justify-between items-center gap-2 sm:gap-4">
        {/* Left: Logo + Title */}
        <Link to="/super-admin">
          <div className="flex items-center gap-2 sm:gap-4">
            <img src={logo} alt="Logo" />
          </div>
        </Link>
        {/* Center: Warning Message - Hidden on Mobile/Tablet */}
        <div className="hidden xl:flex items-center gap-2 flex-1 justify-center">
          <Info className="w-5 h-5 text-[#E88C31] flex-shrink-0" />
          <p className="font-semibold text-sm lg:text-base">
            <span className="text-[#E88C31]">Be Careful</span> As a Super Admin,
            your actions have a big impact. Proceed carefully!
          </p>
        </div>
        {/* Right: Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            arrow
            trigger={["click"]}
          >
            <div className="cursor-pointer flex items-center gap-2 sm:gap-3 bg-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow hover:shadow-md transition-shadow">
              <Avatar
                size="default"
                icon={<UserOutlined />}
                style={{ backgroundColor: "#721011" }}
                className="sm:w-10 sm:h-10"
              />
              <div className="hidden sm:block">
                <p className="text-xs sm:text-sm font-semibold text-gray-800">
                  {`${user?.firstName} ${user?.lastName}`}
                </p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Warning Message for Mobile/Tablet - Below Header */}
      <div className="xl:hidden mt-3 flex items-start gap-2 bg-orange-50 p-3 rounded-lg border border-orange-200">
        <Info className="w-5 h-5 text-[#E88C31] flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm">
          <span className="text-[#E88C31] font-semibold">Be Careful:</span> As a
          Super Admin, your actions have a big impact. Proceed carefully!
        </p>
      </div>
    </section>
  );
};
export default SuperAdminNav;
