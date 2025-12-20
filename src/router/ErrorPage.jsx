import { Button, Result } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl mx-auto px-6">
        <Result
          status="404"
          title={
            <div className="text-6xl md:text-8xl font-bold text-gray-800 mb-4 animate-pulse">
              404
            </div>
          }
          subTitle={
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
                Oops! Page Not Found
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </p>
            </div>
          }
          extra={
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
              <Button
                type="default"
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-8 h-12 text-base font-medium"
              >
                Go Back
              </Button>
              <Link to="/users">
                <Button
                  type="primary"
                  size="large"
                  icon={<HomeOutlined />}
                  className="w-full sm:w-auto px-8 h-12 text-base font-medium bg-[#721011] hover:bg-[#8a1314]"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          }
        />
        
      </div>
    </div>
  );
};

export default ErrorPage;
