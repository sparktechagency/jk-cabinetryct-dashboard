import { NavLink } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ActiveLink = ({ name, icon, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        isActive
          ? "flex p-[10px] m-[6px] cursor-pointer items-center font-medium bg-[#F6F6F6] border-l-2 border-[#721011] text-[#721011] rounded-lg"
          : "flex text-[#4F4F4F] p-[10px] m-[6px] cursor-pointer items-center font-medium  rounded-lg"
      }
    >
      {icon}
      <span className="hidden ml-2 sm:block">{name}</span>
    </NavLink>
  );
};

export default ActiveLink;
