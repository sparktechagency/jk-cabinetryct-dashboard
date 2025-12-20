/* eslint-disable react/no-unescaped-entities */
import { Form, Input, Button } from "antd";
import signin from "../../assets/auth/auth.jpg";
import logo from "../../assets/logo/logo.png";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [forgotpassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (values) => {
    try {
      const res = await forgotpassword(values).unwrap();
      toast.success(res?.message);
      navigate(`/auth/verifyotp?email=${values?.email}`);
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

            <div className="flex items-center gap-2 mb-4">
              <MdOutlineArrowBackIos
                onClick={() => navigate("/auth/login")}
                className="text-2xl cursor-pointer"
              />
              <h1 className="text-[#222222] font-medium text-xl md:text-2xl">
                Forgot Password!
              </h1>
            </div>

            <p className="font-poppins text-[14px] md:text-[16px] font-normal mb-6">
              Enter the email address associated with your account. We'll send
              you an OTP to your email.
            </p>

            <Form
              name="forgot_password"
              layout="vertical"
              onFinish={handleForgotPassword}
              className="space-y-6"
            >
              <Form.Item
                name="email"
                label={
                  <span className="text-base font-semibold text-gray-800">
                    Email <span className="text-primary">*</span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter Your Email"
                  className="py-3 text-base"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  loading={isLoading}
                  type="primary"
                  htmlType="submit"
                  className="w-full h-14 text-lg font-semibold bg-[#721011] text-white border-none"
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
