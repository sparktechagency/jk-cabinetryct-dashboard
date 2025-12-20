import { Button, Form } from "antd";
import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import {
  useAddOrUpdateSettingsMutation,
  useGetSettingsQuery,
} from "../../../../redux/features/settings/settingsApi";
import toast from "react-hot-toast";

const EditPrivacy = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const { data: privacyData, isLoading: isLoadingPrivacy } =
    useGetSettingsQuery("privacyPolicy");
  const [updatePrivacy, { isLoading: isUpdating }] =
    useAddOrUpdateSettingsMutation();

  // Load existing content when data is available
  useEffect(() => {
    if (privacyData?.data?.content) {
      setContent(privacyData.data.content);
    }
  }, [privacyData]);

  const handleEditPrivacy = async () => {
    try {
      await updatePrivacy({
        type: "privacyPolicy",
        content: content,
      }).unwrap();
      toast.success("Privacy Policy content updated successfully!");
      navigate("/super-admin/settings/privacy-policy");
    } catch (error) {
      console.error("Error updating privacy policy:", error);
      toast.error("Failed to update Privacy Policy content. Please try again.");
    }
  };

  if (isLoadingPrivacy && !privacyData) {
    return <div className="mt-8 mx-6">Loading...</div>;
  }

  return (
    <div className="mt-8 mx-6">
      <Link
        to="/super-admin/settings/privacy-policy"
        className="flex items-center gap-2"
      >
        <FaCircleArrowLeft className="text-primaryBg w-8 h-8" />
        <p className="font-semibold text-[30px]">Edit Privacy Policy</p>
      </Link>
      <Form
        labelCol={{ span: 22 }}
        wrapperCol={{ span: 40 }}
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        onFinish={handleEditPrivacy}
      >
        <div className="mt-6">
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => {
              setContent(newContent);
            }}
            config={{
              readonly: false,
              placeholder: "Start typing privacy policy content here...",
            }}
          />
        </div>
        <div className="text-right mt-6">
          <Form.Item>
            <Button
              htmlType="submit"
              loading={isUpdating}
              className="h-[44px] w-[260px] !text-white !bg-primaryBg rounded-[8px]"
            >
              Update Privacy Policy
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditPrivacy;
