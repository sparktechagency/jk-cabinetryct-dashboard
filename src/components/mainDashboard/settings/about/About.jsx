import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useGetSettingsQuery } from "../../../../redux/features/settings/settingsApi";

const About = () => {
  const navigate = useNavigate();
  const { data: aboutData, isLoading, isError } = useGetSettingsQuery('aboutUs');

  if (isLoading) {
    return <div className="mt-8 mx-6">Loading...</div>;
  }

  if (isError) {
    return <div className="mt-8 mx-6">Error loading about us content</div>;
  }

  return (
    <div className="mt-8 mx-6">
      <Link to="/super-admin/settings" className="flex items-center gap-2">
        <FaCircleArrowLeft className="text-primaryBg w-8 h-8" />
        <p className="font-semibold text-[30px]">About Us</p>
      </Link>
      <div className="mt-4">
        {aboutData?.data?.content ? (
          <div dangerouslySetInnerHTML={{ __html: aboutData.data.content }} />
        ) : (
          <p>No content available</p>
        )}
      </div>
      <div className="text-right mt-16">
        <Button
          onClick={() => navigate(`/super-admin/settings/editabout-us`)}
          className="h-[44px] w-[260px] !text-white !bg-primaryBg rounded-[8px]"
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default About;
