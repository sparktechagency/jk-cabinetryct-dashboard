/* eslint-disable react/no-unescaped-entities */
import {
  CheckCircleFilled,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
  GlobalOutlined,
  DollarCircleOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleUserQuery,
  useRejectUserMutation,
  useVerifyUserMutation,
} from "../../../redux/features/users/usersApi";
import toast from "react-hot-toast";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    data: userResponse,
    isLoading,
    isError,
    refetch,
  } = useGetSingleUserQuery(userId);

  const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();
  const [rejectUser] = useRejectUserMutation();

  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const handleFileView = (fileUrl) => {
    if (!fileUrl) {
      toast.error("No file available to view");
      return;
    }
    setCurrentFile(fileUrl);
    setFileModalVisible(true);
  };

  const handleCloseFileModal = () => {
    setFileModalVisible(false);
    setCurrentFile(null);
  };

  const handleVerifyUser = async () => {
    try {
      await verifyUser({
        id: userId,
      }).unwrap();
      toast.success("User verified successfully");
      refetch();
    } catch (error) {
      toast.error(`Failed to verify user: ${error?.data?.message}`);
    }
  };

  const handleRejectUser = async () => {
    try {
      await rejectUser(userId).unwrap();
      toast.success("User rejected successfully");
      refetch();
    } catch (error) {
      toast.error(`Failed to reject user: ${error?.data?.message}`);
    }
  };

  const handleContactUser = () => {
    if (userResponse?.data?.status === "verified") {
      navigate(`/inbox?user=${userId}`);
      toast.success("Opening conversation...");
    } else {
      toast.error("User is not verified yet. Cannot contact unverified users.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white min-h-screen rounded-xl border flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (isError || !userResponse?.data) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white min-h-screen rounded-xl border">
        <h2 className="text-2xl font-semibold mb-6 text-primary">
          User Profile
        </h2>
        <div className="text-center py-10">
          <p className="text-red-500">Error loading user data</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const userData = userResponse.data;

  const statusConfig = {
    unverified: { color: "orange", text: "Unverified" },
    verified: { color: "green", text: "Verified" },
    blocked: { color: "red", text: "Blocked" },
  };
  const status = statusConfig[userData.status] || {
    color: "default",
    text: userData.status,
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white min-h-screen rounded-xl border">
      <h2 className="text-2xl font-semibold mb-6 text-primary">User Profile</h2>

      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={userData.profileImage}
                alt="User Profile"
                className="w-16 h-16 object-cover rounded-full"
              />
              {userData.status === "verified" && (
                <CheckCircleFilled className="absolute bottom-0 right-0 text-green-500 text-lg bg-white rounded-full" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userData.firstName} {userData.lastName}
              </h3>
              <div className="flex gap-4 text-sm text-gray-600 mt-1">
                <span>
                  Status: <Tag color={status.color}>{status.text}</Tag>
                </span>
                {userData?.businessType && (
                  <span>
                    Type:{" "}
                    <Tag color="blue">
                      {userData?.businessType?.charAt(0)?.toUpperCase() +
                        userData?.businessType?.slice(1)}
                    </Tag>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {userData.status === "unverified" ? (
              <>
                <Button onClick={handleRejectUser}>Reject</Button>
                <Button type="primary" onClick={handleVerifyUser}>
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                onClick={handleContactUser}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <span className="mr-2">Message</span>
              </Button>
            )}
            <Button onClick={() => navigate(-1)}>Back to Users</Button>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          User Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Company Name
            </label>
            <div className="text-gray-900">{userData.companyName || "N/A"}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <GlobalOutlined className="mr-1" /> Company Website
            </label>
            <div className="text-blue-600">
              {userData.companyWebsite ? (
                <a
                  href={userData.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userData.companyWebsite}
                </a>
              ) : (
                "N/A"
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <DollarCircleOutlined className="mr-1" /> Estimated Monthly Spend
            </label>
            <div className="text-gray-900">
              ${userData.perMonthSpend?.toLocaleString() || 0}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <ShopOutlined className="mr-1" /> Closest Location
            </label>
            <div className="text-gray-900">
              {userData.closestLocation || "N/A"}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <QuestionCircleOutlined className="mr-1" /> How did you hear about
              us?
            </label>
            <div className="text-gray-900">
              {userData.howHearAboutUs || "N/A"}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <PhoneOutlined className="mr-1" /> Phone
            </label>
            <div className="text-gray-900">{userData.phoneNumber}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <MailOutlined className="mr-1" /> Email
            </label>
            <div className="text-blue-600">{userData.email}</div>
          </div>
        </div>
      </div>

      <div className=" p-6 mb-6">
        <h3 className="text-lg font-semibold mb-5 border-b pb-3 flex items-center gap-2">
          Address Information
        </h3>

        <div className="space-y-5">
          {/* Main Address Line */}
          <div className="flex items-start gap-4">
            <div className="w-32 text-sm font-medium text-gray-600">
              Street Address
            </div>
            <div className="flex-1 text-gray-900">
              {userData.address}
              {userData.addressLine2 && (
                <>
                  <br />
                  <span className="text-gray-700">{userData.addressLine2}</span>
                </>
              )}
            </div>
          </div>

          <div className="border-t pt-4"></div>

          {/* Grid for City, State, Zip, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase  mb-1">
                City
              </div>
              <div className="text-gray-900 font-medium">
                {userData.city || "—"}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase  mb-1">
                State / Province
              </div>
              <div className="text-gray-900 font-medium">
                {userData.state || "—"}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase  mb-1">
                ZIP Code
              </div>
              <div className="text-gray-900 font-medium">
                {userData.zipCode || "—"}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase  mb-1">
                Country
              </div>
              <div className="text-gray-900 font-medium">
                {userData.country || "—"}
              </div>
            </div>
          </div>

          {/* Full Address in One Line (Optional - for copy-paste) */}
          <div className="mt-6 pt-4 border-t">
            <div className="text-xs font-medium text-gray-500 uppercase  mb-2">
              Full Address (Copyable)
            </div>
            <div
              className="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-800 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${userData.address}${
                    userData.addressLine2 ? `, ${userData.addressLine2}` : ""
                  }, ${userData.city}, ${userData.state} ${userData.zipCode}, ${
                    userData.country
                  }`
                );
                toast.success("Address copied to clipboard!");
              }}
            >
              {userData.address}
              {userData.addressLine2 && `, ${userData.addressLine2}`}
              {`, ${userData.city}, ${userData.state} ${userData.zipCode}, ${userData.country}`}
            </div>
          </div>
        </div>
      </div>

      {/* Documents Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Documents</h3>

        {/* Business Document */}
        <div className="mb-6">
          <label className="block text-sm text-gray-900 mb-2">
            Business License / EIN / Tax ID{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadOutlined className="text-gray-400" />
              <span className="text-gray-600">
                {userData.businessDocument
                  ? "Document Uploaded"
                  : "No Document Uploaded"}
              </span>
            </div>
            {userData.businessDocument && (
              <div className="flex gap-2">
                <Button
                  size="small"
                  onClick={() => handleFileView(userData.businessDocument)}
                >
                  View
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sales Tax Exemption */}
        <div className="mb-6">
          <label className="block text-sm text-gray-900 mb-2">
            Sales Tax Exemption Certificate
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <UploadOutlined className="text-gray-400" />
              <span className="text-gray-600">
                {userData.salesTaxExemption
                  ? "Document Uploaded"
                  : "No Document Uploaded"}
              </span>
            </div>
            {userData.salesTaxExemption && (
              <div className="flex gap-2">
                <Button
                  size="small"
                  onClick={() => handleFileView(userData.salesTaxExemption)}
                >
                  View
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File View Modal */}
      <Modal
        title="Document Preview"
        open={fileModalVisible}
        onCancel={handleCloseFileModal}
        footer={null}
        width={800}
      >
        {currentFile && (
          <div style={{ textAlign: "center" }}>
            {currentFile.endsWith(".pdf") ? (
              <iframe
                src={currentFile}
                width="100%"
                height="600px"
                title="File Preview"
                style={{ border: "none" }}
              />
            ) : (
              <img
                src={currentFile}
                alt="Document Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserDetails;
