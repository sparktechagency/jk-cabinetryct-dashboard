import {
  CloseOutlined,
  CrownOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetLoggedUserQuery,
  useUpdateProfileMutation,
} from "../../redux/features/profile/profileApi";
import { imageBaseUrl } from "../../utils/imageBaseUrl";
import toast from "react-hot-toast";

const { TextArea } = Input;

const SuperAdminEditProfile = () => {
  const navigate = useNavigate();
  const { data: mySelf, isLoading, isError } = useGetLoggedUserQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (mySelf) {
      setFormData({
        firstName: mySelf.firstName || "",
        lastName: mySelf.lastName || "",
        email: mySelf.email || "",
        phone: mySelf.phone || "",
        address: mySelf.address || "",
      });

      setPreviewImage(`${imageBaseUrl}${mySelf.profileImage}`);
    }
  }, [mySelf]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("You can only upload image files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.error("Image must be smaller than 2MB!");
    }

    if (isImage && isLt2M) {
      // Set the file for upload
      setProfileImage(file);
      // Create a preview for the uploaded image
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }

    // Return false to prevent automatic upload
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare form data for API call
      const updateData = new FormData();
      updateData.append("firstName", formData.firstName);
      updateData.append("lastName", formData.lastName);
      updateData.append("phone", formData.phone);
      updateData.append("address", formData.address);

      // Add profile image if selected
      if (profileImage) {
        updateData.append("profileImage", profileImage);
      }

      // Call the update profile API
      await updateProfile(updateData).unwrap();
      toast.success("Profile updated successfully!");
      navigate("/super-admin/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/super-admin/profile");
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">Loading profile data...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        Error loading profile data
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#721011]">
            Edit Super Admin Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Update your super admin profile information
          </p>
        </div>

        {/* Edit Form Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#721011] to-[#8B1315] p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={previewImage}
                  size={96}
                  className="border-4 border-white"
                  alt="Profile Preview"
                />
                <Upload
                  name="profileImage"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  className="absolute bottom-0 right-0"
                  accept="image/*"
                  fileList={[]} // Ensure no file list is shown
                >
                  <Button
                    size="small"
                    icon={<UploadOutlined />}
                    shape="circle"
                    className="bg-white text-[#721011] border border-[#721011]"
                  />
                </Upload>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{`${formData.firstName} ${formData.lastName}`}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <CrownOutlined className="text-yellow-300" />
                  <p className="text-red-100">
                    {mySelf?.role === "super_admin" ? "Super Admin" : "Admin"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  size="large"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
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
                  className="bg-gray-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  size="large"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <TextArea
                  size="large"
                  rows={4}
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
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
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={updating}
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

export default SuperAdminEditProfile;
