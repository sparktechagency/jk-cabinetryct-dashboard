import {
  ArrowLeftOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleCabinetryQuery,
  useUpdateCabinetryMutation,
} from "../../../redux/features/cabinetry/cabinetryApi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles

const EditCabinetry = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { cabinetId } = useParams();

  const { data: cabinetryData, isLoading: isFetching } =
    useGetSingleCabinetryQuery(cabinetId);
  const [updateCabinetry, { isLoading }] = useUpdateCabinetryMutation();

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newFileList, setNewFileList] = useState([]);

  useEffect(() => {
    if (cabinetryData?.data) {
      const cabinet = cabinetryData.data;
      form.setFieldsValue({
        code: cabinet.code,
        colorName: cabinet.color,
        description: cabinet.description, // This should be HTML string from DB
      });
      setExistingImages(cabinet.images || []);
    }
  }, [cabinetryData, form]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("color", values.colorName);
      formData.append("description", values.description); 

      // Add deleted images
      if (deletedImages.length > 0) {
        formData.append("deletedImages", JSON.stringify(deletedImages));
      }

      // Add new images
      newFileList.forEach((file) => {
        formData.append("images", file.originFileObj || file);
      });

      const res = await updateCabinetry({
        data: formData,
        id: cabinetId,
      }).unwrap();
      toast.success(res?.message || "Cabinetry updated successfully");
      navigate("/cabinetry");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update cabinetry");
    }
  };

  const handleDeleteExistingImage = (imagePath) => {
    setExistingImages(existingImages.filter((img) => img !== imagePath));
    setDeletedImages([...deletedImages, imagePath]);
  };

  const handleNewUpload = ({ fileList: newFiles }) => {
    setNewFileList(newFiles);
  };

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/cabinetry")}
          className="text-gray-600 hover:text-primary"
        />
        <h2 className="text-xl font-semibold text-primary">Edit Cabinetry</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-6">
            <label className="block text-base font-semibold mb-3">
              Existing Images
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {existingImages.map((imagePath, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imagePath}
                    alt={`Cabinet ${index + 1}`}
                    className="w-full h-56 object-cover rounded border"
                  />
                  <Button
                    type="primary"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteExistingImage(imagePath)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Photos */}
        <Form.Item
          label={
            <span className="text-base font-semibold">Upload New Photos</span>
          }
        >
          <Upload
            listType="picture-card"
            fileList={newFileList}
            onChange={handleNewUpload}
            beforeUpload={() => false}
            multiple
            accept="image/*"
          >
            {newFileList.length + existingImages.length >= 8 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <div className="text-xs text-gray-500 mt-2">
            Total images (existing + new) should not exceed 8
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
            <Input size="large" />
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
            <Input size="large" />
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
            placeholder="Write a description about the cabinetry..."
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
              marginBottom: "60px", // Space for toolbar + buttons
            }}
          />
        </Form.Item>

        {/* Footer Buttons */}
        <Form.Item>
          <div className="flex justify-end gap-3">
            <Button
              size="large"
              onClick={() => navigate("/cabinetry")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-[#721011] px-8"
              loading={isLoading}
            >
              Update
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCabinetry;
