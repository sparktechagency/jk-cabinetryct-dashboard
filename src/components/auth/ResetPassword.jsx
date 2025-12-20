import { useState } from "react";
import { Form, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import signin from "../../assets/auth/auth.jpg";
import logo from "../../assets/logo/logo.png";
import { MdOutlineArrowBackIos } from "react-icons/md";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../../redux/features/auth/authApi";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const handlePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const handleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const validateConfirmPassword = (rule, value) => {
    const { newPassword } = form.getFieldsValue();
    if (value && value !== newPassword) {
      return Promise.reject("Passwords do not match!");
    }
    return Promise.resolve();
  };

  const [reset] = useResetPasswordMutation();

  const resetPassword = async (values) => {
    const paylod = {
      email: email,
      newPassword: values.newPassword,
    };
    try {
      const res = await reset(paylod).unwrap();
      if (res?.statusCode == 200) {
        toast.success(res?.message);
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        {/* Left Side - Image */}
        <div className="hidden lg:block w-full col-span-1 h-screen">
          <img
            src={signin}
            alt="J&K Cabinetry"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right Side - Form */}
        <div className="w-full col-span-2 mx-auto flex items-center justify-center py-12 px-8 lg:px-16">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src={logo} alt="Logo" className="h-16 mx-auto" />
            </div>

            <div className="flex items-center gap-2 mb-6">
              <MdOutlineArrowBackIos
                onClick={() => navigate("/auth/verifyotp")}
                className="text-2xl cursor-pointer"
              />
              <h1 className="text-[#222222] font-medium text-xl md:text-2xl">
                Update Password!
              </h1>
            </div>

            <Form
              form={form}
              layout="vertical"
              className="space-y-6"
              onFinish={resetPassword}
            >
              <Form.Item
                label={
                  <span className="text-base font-semibold text-gray-800">
                    New Password <span className="text-primary">*</span>
                  </span>
                }
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="New password"
                  className="py-3 text-base"
                  iconRender={(visible) =>
                    visible ? (
                      <EyeOutlined onClick={handlePasswordVisibility} />
                    ) : (
                      <EyeInvisibleOutlined
                        onClick={handlePasswordVisibility}
                      />
                    )
                  }
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-base font-semibold text-gray-800">
                    Confirm Password <span className="text-primary">*</span>
                  </span>
                }
                name="confirmNewPassword"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  { validator: validateConfirmPassword },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Confirm Password"
                  className="py-3 text-base"
                  iconRender={(visible) =>
                    visible ? (
                      <EyeOutlined onClick={handleConfirmPasswordVisibility} />
                    ) : (
                      <EyeInvisibleOutlined
                        onClick={handleConfirmPasswordVisibility}
                      />
                    )
                  }
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-14 text-lg font-semibold bg-[#721011] text-white border-none"
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
