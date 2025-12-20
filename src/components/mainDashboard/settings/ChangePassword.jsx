import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../../../redux/features/profile/profileApi";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    try {
      await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      form.resetFields();
      setTimeout(() => {
        navigate("/super-admin/settings"); // Navigate back to settings
      }, 1000);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error?.data?.message || "Failed to change password. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <Link to="/settings" className="flex items-center text-[#721011]">
              <ArrowLeftOutlined className="mr-2" />
              Back to Settings
            </Link>
            <h2 className="text-2xl font-bold text-center text-[#721011]">
              Change Password
            </h2>
          </div>

          <Form
            form={form}
            name="change_password"
            initialValues={{ remember: true }}
            onFinish={handleChangePassword}
            layout="vertical"
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Current Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="New Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmNewPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm New Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full"
                style={{ backgroundColor: "#721011" }}
                size="large"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
