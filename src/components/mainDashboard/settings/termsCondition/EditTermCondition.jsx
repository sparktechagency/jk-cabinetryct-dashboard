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

const EditTermCondition = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const { data: termsData, isLoading: isLoadingTerms } =
    useGetSettingsQuery("termsConditions");
  const [updateTerms, { isLoading: isUpdating }] =
    useAddOrUpdateSettingsMutation();

  // Load existing content when data is available
  useEffect(() => {
    if (termsData?.data?.content) {
      setContent(termsData.data.content);
    }
  }, [termsData]);

  const handleEditTermsCondition = async () => {
    try {
      await updateTerms({
        type: "termsConditions",
        content: content,
      }).unwrap();
      toast.success("Terms & Conditions content updated successfully!");
      navigate("/super-admin/settings/term-condition");
    } catch (error) {
      console.error("Error updating terms and conditions:", error);
      toast.error(
        "Failed to update Terms & Conditions content. Please try again."
      );
    }
  };

  if (isLoadingTerms && !termsData) {
    return <div className="mt-8 mx-6">Loading...</div>;
  }

  return (
    <div className="mt-8 mx-6">
      <Link
        to="/super-admin/settings/term-condition"
        className="flex items-center gap-2"
      >
        <FaCircleArrowLeft className="!text-primaryBg w-8 h-8" />
        <p className="font-semibold text-[30px]">Edit Term&Condition</p>
      </Link>
      <Form
        labelCol={{ span: 22 }}
        wrapperCol={{ span: 40 }}
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        onFinish={handleEditTermsCondition}
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
              placeholder: "Start typing terms and conditions content here...",
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
              Update Terms & Conditions
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditTermCondition;
