import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const Profile = () => {
  // Dummy data - replace with actual user data from context/API
  const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main Street, City, State 12345",
    role: "Admin",
    branch: "Main Branch",
    joinedDate: "January 15, 2024",
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#721011]">Profile</h1>
            <p className="text-gray-600 mt-1">
              View and manage your profile information
            </p>
          </div>
          <Link to="/editprofile">
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
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="w-12 h-12 text-[#721011]" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-red-100 mt-1">{userData.role}</p>
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
                  <p className="text-gray-800 mt-1">{userData.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="w-5 h-5 text-[#721011]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-800 mt-1">{userData.phone}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="w-5 h-5 text-[#721011]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Address</p>
                  <p className="text-gray-800 mt-1">{userData.address}</p>
                </div>
              </div>

              {/* Branch */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaUser className="w-5 h-5 text-[#721011]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Branch</p>
                  <p className="text-gray-800 mt-1">{userData.branch}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Member since:{" "}
                <span className="text-gray-800 font-medium">
                  {userData.joinedDate}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;