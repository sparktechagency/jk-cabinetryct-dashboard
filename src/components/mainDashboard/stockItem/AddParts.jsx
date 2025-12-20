import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Upload } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddPartMutation } from "../../../redux/features/parts/partsApi";
import toast from "react-hot-toast";

const { TextArea } = Input;

const AddParts = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { stockItemId, stockItemTitleId } = useParams();
  const [addPart, { isLoading }] = useAddPartMutation();
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("code", values.code);
      formData.append("description", values.description);
      formData.append("stockItemId", stockItemId);
      formData.append("stockItemTitleId", stockItemTitleId);

      // Add price object
      const priceObj = {
        wholesale: values.wholesale,
        wholesaleWithTenPercent: values.wholesaleWithTenPercent,
        contractor: values.contractor,
      };
      formData.append("price", JSON.stringify(priceObj));
      formData.append("assemblyPrice", values.assemblyPrice);

      // Append all images
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj || file);
      });

      const res = await addPart(formData).unwrap();
      toast.success(res?.message || "Part added successfully");
      form.resetFields();
      setFileList([]);
      navigate(`/stock-items/details/${stockItemId}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add part");
    }
  };

  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/stock-items/details/${stockItemId}`)}
          className="text-gray-600 hover:text-primary"
        />
        <h2 className="text-xl font-semibold text-primary">Add New Part</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Upload Photos */}
        <Form.Item
          label={
            <span className="text-base font-semibold">
              Upload Part Photos <span className="text-red-500">*</span>
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

        {/* Title and Code */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-base font-semibold">
                Title <span className="text-red-500">*</span>
              </span>
            }
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="e.g. Base Cabinet" size="large" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-base font-semibold">
                Code <span className="text-red-500">*</span>
              </span>
            }
            name="code"
            rules={[{ required: true, message: "Please enter code" }]}
          >
            <Input placeholder="e.g. B09" size="large" />
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
            rows={6}
            placeholder="Write a detailed description about the part..."
            className="resize-none"
          />
        </Form.Item>

        {/* Price Fields */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-base font-semibold mb-4">
            Price Information <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Wholesale Price ($)"
              name="wholesale"
              rules={[
                { required: true, message: "Please enter wholesale price" },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Wholesale +10% ($)"
              name="wholesaleWithTenPercent"
              rules={[
                {
                  required: true,
                  message: "Please enter wholesale with 10% price",
                },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Contractor Price ($)"
              name="contractor"
              rules={[
                { required: true, message: "Please enter contractor price" },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Assembly Price ($)"
              name="assemblyPrice"
              rules={[
                { required: true, message: "Please enter assembly price" },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>
        </div>

        {/* Footer Buttons */}
        <Form.Item>
          <div className="flex justify-end gap-3">
            <Button
              size="large"
              onClick={() => navigate(`/stock-items/details/${stockItemId}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-[#721011]"
              loading={isLoading}
            >
              Add Part
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddParts;
