import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { Button } from "antd";
import { EditOutlined, CrownOutlined } from "@ant-design/icons";
import { useGetLoggedUserQuery } from "../../redux/features/profile/profileApi";
import { imageBaseUrl } from "../../utils/imageBaseUrl";

const SuperAdminProfile = () => {
  const { data: mySelf } = useGetLoggedUserQuery();
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#721011]">
              Super Admin Profile
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your super admin profile information
            </p>
          </div>
          <Link to="/super-admin/editprofile">
            <Button
              type="primary"
              size="large"
              icon={<EditOutlined />}
              style={{ backgroundColor: "#721011" }}
            >
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#721011] to-[#8B1315] p-6">
            <div className="flex items-center gap-6">
              <img
                src={`${imageBaseUrl}${mySelf?.profileImage}`}
                alt="Profile"
                className="w-24 h-24 rounded-full "
              />
              <div className="text-white">
                <h2 className="text-2xl font-bold">{`${mySelf?.firstName} ${mySelf?.lastName}`}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <CrownOutlined className="text-yellow-300" />
                  <p className="text-red-100">
                    {mySelf?.role === "super_admin" ? "Super Admin" : "Admin"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="w-5 h-5 text-[#721011]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-gray-800 mt-1">{mySelf?.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="w-5 h-5 text-[#721011]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-800 mt-1">{mySelf?.phone || "N/A"}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="w-5 h-5 text-[#721011]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Address</p>
                  <p className="text-gray-800 mt-1">
                    {mySelf?.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* Permissions */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="w-5 h-5 text-[#721011]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Access Level
                  </p>
                  <p className="text-gray-800 mt-1">Full System Access</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Member since:{" "}
                <span className="text-gray-800 font-medium">
                  {mySelf?.createdAt}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
