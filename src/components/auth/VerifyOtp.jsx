import signin from "../../assets/auth/auth.jpg";
import logo from "../../assets/logo/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import OTPInput from "react-otp-input";
import { Button } from "antd";
import { MdOutlineArrowBackIos } from "react-icons/md";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const verifyData = {
    email: email,
    otp: otp,
  };

  const sendOtp = async () => {
    try {
      const res = await verifyOtp(verifyData).unwrap();
      toast.success(res?.message);
      navigate(`/auth/resetpassword?email=${email}`);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    try {
      const res = await resendOtp({ email }).unwrap();
      toast.success(res?.message || "OTP resent successfully");
      setCountdown(60);
      setCanResend(false);
      setOtp("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resend OTP");
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
                onClick={() => navigate("/auth/forgotpassword")}
                className="text-2xl cursor-pointer"
              />
              <h1 className="text-[#222222] font-medium text-xl md:text-2xl">
                Verify OTP!
              </h1>
            </div>

            <p className="font-poppins text-[14px] md:text-[16px] font-normal mb-6">
              We&apos;ve sent a verification code to your email. Check your
              inbox and enter the code here.
            </p>

            <div className="py-4">
              <div className="flex justify-center items-center gap-2 outline-none focus:border-blue-400 w-full">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  inputStyle={{
                    height: "52px",
                    width: "55px",
                    background: "transparent",
                    border: "1px solid #721011",
                    borderRadius: "10px",
                    marginRight: "8px",
                    outline: "none",
                  }}
                  renderSeparator={<span className="md:w-2"> </span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <div className="flex justify-between items-center mt-6">
                <small className="text-[14px] font-normal text-gray-600">
                  Didn&apos;t receive the code?
                </small>
                {canResend ? (
                  <small
                    onClick={handleResendOtp}
                    className={`text-[14px] font-medium text-[#721011] cursor-pointer hover:underline ${
                      isResending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isResending ? "Sending..." : "Resend"}
                  </small>
                ) : (
                  <small className="text-[14px] font-medium text-gray-400">
                    Resend in {formatTime(countdown)}
                  </small>
                )}
              </div>
            </div>

            <Button
              type="primary"
              onClick={sendOtp}
              loading={isVerifying}
              disabled={otp.length !== 6}
              className="w-full h-14 text-lg font-semibold bg-[#721011] text-white border-none mt-4"
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
