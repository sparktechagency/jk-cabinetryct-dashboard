import { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAddcabinetryMutation } from "../../../redux/features/cabinetry/cabinetryApi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Important: Quill styles

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
      formData.append("description", values.description); // This will be HTML string
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
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
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
            beforeUpload={() => false} // Prevent auto upload
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

        {/* Rich Text Description with React Quill */}
        <Form.Item
          label={
            <span className="text-base font-semibold">
              Description <span className="text-red-500">*</span>
            </span>
          }
          name="description"
          rules={[
            { required: true, message: "Please enter description" },
            {
              validator: (_, value) => {
                const text = value ? value.replace(/<[^>]*>/g, "").trim() : "";
                return text.length > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Description cannot be empty"));
              },
            },
          ]}
        >
          <ReactQuill
            theme="snow"
            placeholder={`Write a description about the cabinetry...\n\nExample:\nS8 - White Shaker\n\n• Door Panel: 3/4”-thick solid wood; full overlay door.\n• Door Hinge: 6-way adjustable; soft-close metal; hidden Euro-style.\n• Adjustable Shelf: 5/8”-thick cabinet-grade plywood...`}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "list",
              "bullet",
              "indent",
            ]}
            style={{
              height: "320px", // Editor height
              marginBottom: "60px", // Space for toolbar + submit buttons
            }}
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
