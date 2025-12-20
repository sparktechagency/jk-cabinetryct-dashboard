import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import signin from "../../assets/auth/auth.jpg";
import logo from "../../assets/logo/logo.png";
import { useLoginMutation } from "../../redux/features/auth/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [adminLogin, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      const res = await adminLogin(values).unwrap();
      toast.success(res?.message);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
      localStorage.setItem("token", res?.data?.tokens?.accessToken);
      const userRole = res?.data?.user?.role;
      if (userRole === "super_admin" || userRole === "admin") {
        navigate("/users");
      } else {
        toast.error("You are not authorized to access this page.");
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
        <div className="w-full col-span-2 mx-auto  flex items-center justify-center py-12 px-8 lg:px-16">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src={logo} alt="Logo" className="h-16 mx-auto" />
            </div>

            <Form layout="vertical" onFinish={onFinish} className="space-y-6">
              {/* Email */}
              <Form.Item
                name="email"
                label={
                  <span className="text-base font-semibold text-gray-800">
                    Email <span className="text-primary">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="type email or user name"
                  className="py-3 text-base"
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                name="password"
                label={
                  <span className="text-base font-semibold text-gray-800">
                    Password <span className="text-primary">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="type password"
                  className="py-3 text-base"
                />
              </Form.Item>

              {/* Forgot Password - Right Aligned */}
              <div className="text-right -mt-4 mb-4">
                <Link
                  to="/auth/forgotpassword"
                  className="text-[#721011] text-sm font-medium hover:underline"
                >
                  Forgot Password
                </Link>
              </div>

              {/* Submit Button */}
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  loading={isLoading}
                  htmlType="submit"
                  className="w-full h-14 text-lg font-semibold bg-[#721011]  text-white border-none"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
