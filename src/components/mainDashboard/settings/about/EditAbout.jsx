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

const EditAbout = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const { data: aboutData, isLoading: isLoadingAbout } =
    useGetSettingsQuery("aboutUs");
  const [updateAbout, { isLoading: isUpdating }] =
    useAddOrUpdateSettingsMutation();

  // Load existing content when data is available
  useEffect(() => {
    if (aboutData?.data?.content) {
      setContent(aboutData.data.content);
    }
  }, [aboutData]);

  const handleEditAbout = async () => {
    try {
      await updateAbout({
        type: "aboutUs",
        content: content,
      }).unwrap();
      toast.success("About Us content updated successfully!");
      navigate("/super-admin/settings/about");
    } catch (error) {
      console.error("Error updating about us:", error);
      toast.error("Failed to update About Us content. Please try again.");
    }
  };

  if (isLoadingAbout && !aboutData) {
    return <div className="mt-8 mx-6">Loading...</div>;
  }

  return (
    <div className="mt-8 mx-6">
      <Link
        to="/super-admin/settings/about"
        className="flex items-center gap-2"
      >
        <FaCircleArrowLeft className="!text-primaryBg w-8 h-8" />
        <p className="font-semibold text-[30px]">Edit About</p>
      </Link>
      <Form
        labelCol={{ span: 22 }}
        wrapperCol={{ span: 40 }}
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        onFinish={handleEditAbout}
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
              placeholder: "Start typing about us content here...",
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
              Update About Us
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditAbout;
