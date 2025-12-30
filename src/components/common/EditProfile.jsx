import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { Input, Button } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useGetLoggedUserQuery } from "../../redux/features/profile/profileApi";

const EditProfile = () => {
  const navigate = useNavigate();
  const { data: user } = useGetLoggedUserQuery();
  console.log("User", user);

  // Initial form data - replace with actual user data from context/API
  const [formData, setFormData] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#721011]">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your profile information</p>
        </div>

        {/* Edit Form Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#721011] to-[#8B1315] p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="w-12 h-12 text-[#721011]" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{`${formData.firstName} ${formData.lastName}`}</h2>
                <p className="text-red-100 mt-1">{formData.role}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  size="large"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  size="large"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  size="large"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  disabled
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-end">
              <Button
                size="large"
                icon={<CloseOutlined />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                htmlType="submit"
                style={{ backgroundColor: "#721011" }}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
