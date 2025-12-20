import { Link } from "react-router-dom";
import { FaInfoCircle, FaKey, FaShieldAlt, FaUserTimes } from "react-icons/fa";
import { Button, Modal } from "antd";
import {
  LockOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { FaFileContract } from "react-icons/fa6";
import { useDeleteProfileMutation } from "../../redux/features/profile/profileApi";

const { confirm } = Modal;

const SuperAdminSettings = () => {
  const [deleteProfile, { isLoading: deletingProfile }] =
    useDeleteProfileMutation();

  const settingsItems = [
    {
      title: "Privacy Policy",
      description: "View and manage your privacy policy",
      icon: <FaShieldAlt className="w-8 h-8 text-[#721011]" />,
      viewPath: "/super-admin/settings/privacy-policy",
      editPath: "/super-admin/settings/editprivacy-policy",
      bgColor: "bg-red-50",
      type: "normal",
    },
    {
      title: "Terms & Condition",
      description: "View and manage terms and conditions",
      icon: <FaFileContract className="w-8 h-8 text-[#721011]" />,
      viewPath: "/super-admin/settings/term-condition",
      editPath: "/super-admin/settings/edit-termcondition",
      bgColor: "bg-red-50",
      type: "normal",
    },
    {
      title: "About Us",
      description: "View and manage about us information",
      icon: <FaInfoCircle className="w-8 h-8 text-[#721011]" />,
      viewPath: "/super-admin/settings/about",
      editPath: "/super-admin/settings/edit-about",
      bgColor: "bg-red-50",
      type: "normal",
    },
  ];

  const accountSettings = [
    {
      title: "Change Password",
      description: "Update your account password",
      icon: <FaKey className="w-8 h-8 text-[#721011]" />,
      actionPath: "/super-admin/settings/change-password",
      bgColor: "bg-orange-50",
      type: "action",
      buttonText: "Change Password",
      buttonIcon: <LockOutlined />,
    },
    {
      title: "Delete Account",
      description: "Permanently delete your account",
      icon: <FaUserTimes className="w-8 h-8 text-red-600" />,
      bgColor: "bg-red-100",
      type: "danger",
      buttonText: "Delete Account",
      buttonIcon: <DeleteOutlined />,
    },
  ];

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete your Super Admin account?",
      icon: <ExclamationCircleOutlined />,
      content:
        "WARNING: This action cannot be undone. All system data will be affected. Please proceed with extreme caution!",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#721011]">
            Super Admin Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your super admin account and system settings
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-8 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <ExclamationCircleOutlined className="text-orange-500 text-2xl" />
            <div>
              <p className="font-semibold text-orange-800">
                Super Admin Access
              </p>
              <p className="text-sm text-orange-700">
                Changes made here affect the entire system. Proceed with
                caution.
              </p>
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Content Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsItems.map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6`}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">{item.icon}</div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">{item.description}</p>
                <div className="flex gap-3">
                  <Link to={item.viewPath} className="flex-1">
                    <Button
                      size="large"
                      icon={<EyeOutlined />}
                      className="w-full"
                    >
                      View
                    </Button>
                  </Link>
                  <Link to={item.editPath} className="flex-1">
                    <Button
                      type="primary"
                      size="large"
                      icon={<EditOutlined />}
                      className="w-full"
                      style={{ backgroundColor: "#721011" }}
                    >
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Account Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accountSettings.map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6`}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">{item.icon}</div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">{item.description}</p>
                <div>
                  {item.type === "action" && item.actionPath ? (
                    <Link to={item.actionPath}>
                      <Button
                        type="primary"
                        size="large"
                        icon={item.buttonIcon}
                        className="w-full"
                        style={{ backgroundColor: "#721011" }}
                      >
                        {item.buttonText}
                      </Button>
                    </Link>
                  ) : item.type === "danger" ? (
                    <Button
                      danger
                      size="large"
                      icon={item.buttonIcon}
                      className="w-full"
                      loading={deletingProfile}
                      onClick={showDeleteConfirm}
                    >
                      {item.buttonText}
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
