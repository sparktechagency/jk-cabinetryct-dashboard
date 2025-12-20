import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useGetSettingsQuery } from "../../../../redux/features/settings/settingsApi";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { data: privacyData, isLoading, isError } = useGetSettingsQuery('privacyPolicy');

  if (isLoading) {
    return <div className="h-[575px]">
      <div className="mt-8 mx-6">Loading...</div>
    </div>;
  }

  if (isError) {
    return <div className="h-[575px]">
      <div className="mt-8 mx-6">Error loading privacy policy content</div>
    </div>;
  }

  return (
    <div className="h-[575px]">
      <div className="mt-8 mx-6">
        <Link to="/super-admin/settings" className="flex items-center gap-2">
          <FaCircleArrowLeft className="text-primaryBg w-8 h-8" />
          <p className="font-semibold text-[30px]">Privacy Policy</p>
        </Link>
        <div className="mt-4">
          {privacyData?.data?.content ? (
            <div dangerouslySetInnerHTML={{ __html: privacyData.data.content }} />
          ) : (
            <p>No content available</p>
          )}
        </div>
        <div className="text-right mt-16">
          <Button
            onClick={() => navigate(`/super-admin/settings/editprivacy-policy`)}
            className="h-[44px] w-[260px] !text-white !bg-primaryBg rounded-[8px]"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
