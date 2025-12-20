import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useGetSettingsQuery } from "../../../../redux/features/settings/settingsApi";

const TermCondition = () => {
  const navigate = useNavigate();
  const {
    data: termsData,
    isLoading,
    isError,
  } = useGetSettingsQuery("termsConditions");

  if (isLoading) {
    return <div className="mt-8 mx-6">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="mt-8 mx-6">
        Error loading terms and conditions content
      </div>
    );
  }

  return (
    <div className="mt-8 mx-6">
      <Link to="/super-admin/settings" className="flex items-center gap-2">
        <FaCircleArrowLeft className="text-primaryBg w-8 h-8" />
        <p className="font-semibold text-[30px]">Terms & Condition</p>
      </Link>
      <div className="mt-4">
        {termsData?.data?.content ? (
          <div dangerouslySetInnerHTML={{ __html: termsData.data.content }} />
        ) : (
          <p>No content available</p>
        )}
      </div>
      <div className="text-right mt-16">
        <Button
          onClick={() => navigate(`/super-admin/settings/edit-termcondition`)}
          className="h-[44px] w-[260px] !text-white !bg-primaryBg rounded-[8px]"
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default TermCondition;
