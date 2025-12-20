import { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAddcabinetryMutation } from "../../../redux/features/cabinetry/cabinetryApi";
import toast from "react-hot-toast";

const { TextArea } = Input;

const AddCabinetry = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [addCabinetry, { isLoading }] = useAddcabinetryMutation();
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("color", values.colorName);
      formData.append("description", values.description);
      formData.append("cabinetryCategoryId", categoryId);

      // Append all images
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj || file);
      });

      const res = await addCabinetry(formData).unwrap();
      toast.success(res?.message || "Cabinetry added successfully");
      form.resetFields();
      setFileList([]);
      navigate("/cabinetry");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add cabinetry");
    }
  };

  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleRemoveImage = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl ">
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/cabinetry")}
          className="text-gray-600 hover:text-primary"
        />
        <h2 className="text-xl font-semibold text-primary">
          Add New Cabinetry
        </h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Upload Photos */}
        <Form.Item
          label={
            <span className="text-base font-semibold">
              Upload Cabinetry Photos <span className="text-red-500">*</span>
            </span>
          }
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUpload}
            beforeUpload={() => false}
            multiple
            accept="image/*"
            onRemove={handleRemoveImage}
          >
            {fileList.length >= 8 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <div className="text-xs text-gray-500 mt-2">
            You can upload up to 8 images. Supported formats: JPG, PNG, JPEG
          </div>
        </Form.Item>

        {/* Code and Color Name */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-base font-semibold">
                Code <span className="text-red-500">*</span>
              </span>
            }
            name="code"
            rules={[{ required: true, message: "Please enter code" }]}
          >
            <Input placeholder="S5" size="large" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-base font-semibold">
                Color Name <span className="text-red-500">*</span>
              </span>
            }
            name="colorName"
            rules={[{ required: true, message: "Please enter color name" }]}
          >
            <Input placeholder="White" size="large" />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item
          label={
            <span className="text-base font-semibold">
              Description <span className="text-red-500">*</span>
            </span>
          }
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea
            rows={8}
            placeholder="Write a description about the cabinetry..."
            className="resize-none"
          />
        </Form.Item>

        {/* Footer Buttons */}
        <Form.Item>
          <div className="flex justify-end gap-3">
            <Button
              type="default"
              size="large"
              className="px-8"
              disabled={isLoading}
              onClick={() => navigate("/cabinetry")}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="px-8 bg-[#721011]"
              loading={isLoading}
            >
              Publish
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCabinetry;
