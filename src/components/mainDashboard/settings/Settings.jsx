import { Link, useNavigate } from "react-router-dom";
import { FaKey, FaUserTimes } from "react-icons/fa";
import { Button, Modal } from "antd";
import {
  LockOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDeleteProfileMutation } from "../../../redux/features/profile/profileApi";
import toast from "react-hot-toast";

const { confirm } = Modal;

const Settings = () => {
  const navigate = useNavigate();
  const [deleteProfile] = useDeleteProfileMutation();
  const accountSettings = [
    {
      title: "Change Password",
      description: "Update your account password",
      icon: <FaKey className="w-8 h-8 text-[#721011]" />,
      actionPath: "/settings/change-password",
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

  const handleDelete = async () => {
    try {
      const res = await deleteProfile().unwrap();
      toast.success(res?.message);
      localStorage.clear();
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete your account?",
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. All your data will be permanently deleted.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: handleDelete,
      centered: true,
    });
  };
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#721011]">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your application settings and content
          </p>
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

export default Settings;
