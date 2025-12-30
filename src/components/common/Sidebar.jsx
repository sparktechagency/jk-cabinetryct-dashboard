/* eslint-disable react/prop-types */
import logo from "../../assets/logo/jk-cabinetryct-logo.png";
import { RiAdminLine } from "react-icons/ri";
import { ListOrdered, Users, X } from "lucide-react";
import ActiveLink from "../../components/common/ActiveLink";
import { Link } from "react-router-dom";
import { SiStockx } from "react-icons/si";
import { BiCabinet, BiCollection } from "react-icons/bi";

const Sidebar = ({ onClose }) => {
  const navLinks = [
    {
      path: "users",
      name: "Users Management",
      icon: <Users className="h-7 w-7 lg:h-5 lg:w-5" />,
    },
    {
      path: "collection",
      name: "Collection",
      icon: <BiCollection className="h-7 w-7 lg:h-5 lg:w-5" />,
    },
    {
      path: "cabinetry",
      name: "Cabinetry",
      icon: <BiCabinet className="h-7 w-7 lg:h-5 lg:w-5" />,
    },
    {
      path: "stock-items",
      name: "Stock Items",
      icon: <SiStockx className="h-7 w-7 lg:h-5 lg:w-5" />,
    },
    {
      path: "order",
      name: "Order",
      icon: <ListOrdered className="h-7 w-7 lg:h-5 lg:w-5" />,
    },
    {
      path: "settings",
      name: "Settings",
      icon: <RiAdminLine className="h-7 w-7 lg:h-5 lg:w-5" />,
    },
  ];
  return (
    <div className="w-[280px] bg-white shadow-2xl h-screen flex flex-col">
      {/* Close Button - Mobile Only */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-50"
      >
        <X className="w-6 h-6 text-gray-600" />
      </button>

      {/* Logo and Branch - Fixed at top */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 pt-6 border-b border-gray-200">
        <Link to="/" onClick={onClose}>
          <img className="rounded-lg h-[54px]" src={logo} alt="Logo " />
        </Link>
      </div>

      {/* Navigation Links - Scrollable */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="flex flex-col gap-2">
          {navLinks?.map((link, index) => (
            <li key={index} onClick={onClose}>
              <ActiveLink name={link.name} icon={link.icon} path={link.path} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">© 2025 JK Cabinetry</p>
      </div>
    </div>
  );
};

export default Sidebar;
