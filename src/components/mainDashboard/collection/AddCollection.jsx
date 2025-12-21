import { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAddCollectionMutation } from "../../../redux/features/collection/collectionApi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MAX_FILES = 20; // Match backend limit
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const AddCollection = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [addCollection, { isLoading }] = useAddCollectionMutation();
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

      // Append all images
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj || file);
      });

      const res = await addCollection(formData).unwrap();
      toast.success(res?.message || "Collection added successfully");
      form.resetFields();
      setFileList([]);
      navigate("/collection");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.data?.message || "Failed to add collection");
    }
  };

  const handleUpload = ({ fileList: newFileList }) => {
    // Validate file count
    if (newFileList.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    // Validate each file size
    const oversizedFiles = newFileList.filter(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFiles.length > 0) {
      toast.error(
        `File size should not exceed 50MB. Found ${oversizedFiles.length} oversized file(s)`
      );
      return;
    }

    setFileList(newFileList);
  };

  const handleRemoveImage = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
  };

  // Custom validation before upload
  const beforeUpload = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} exceeds 50MB limit`);
      return false;
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(`${file.name} is not a supported image format`);
      return false;
    }

    // Check total file count (including this file)
    if (fileList.length >= MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return false;
    }

    return false; // Prevent auto upload
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/collection")}
          className="text-gray-600 hover:text-primary"
        />
        <h2 className="text-xl font-semibold text-primary">
          Add New Collection
        </h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Upload Photos */}
        <Form.Item
          label={
            <span className="text-base font-semibold">
              Upload Collection Photos <span className="text-red-500">*</span>
            </span>
          }
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUpload}
            beforeUpload={beforeUpload}
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic,image/heif"
            onRemove={handleRemoveImage}
            maxCount={MAX_FILES}
          >
            {fileList.length >= MAX_FILES ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <div className="text-xs text-gray-500 mt-2">
            You can upload up to {MAX_FILES} images. Maximum file size: 50MB.
            Supported formats: JPG, PNG, GIF, WEBP, HEIC, HEIF
          </div>
          {fileList.length > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              {fileList.length} / {MAX_FILES} files selected
            </div>
          )}
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
            { required: true },
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
            placeholder={`Write a description about the collection...\n\nExample:\nS8 - White Shaker\n\n• Door Panel: 3/4"-thick solid wood; full overlay door.\n• Door Hinge: 6-way adjustable; soft-close metal; hidden Euro-style.\n• Adjustable Shelf: 5/8"-thick cabinet-grade plywood...`}
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
              height: "320px",
              marginBottom: "60px",
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
              onClick={() => navigate("/collection")}
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

export default AddCollection;
