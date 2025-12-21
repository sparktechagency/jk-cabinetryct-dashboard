import {
  ArrowLeftOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSinglePartQuery,
  useUpdatePartMutation,
} from "../../../redux/features/parts/partsApi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditParts = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { partId } = useParams();

  const { data: partData, isLoading: isFetching } =
    useGetSinglePartQuery(partId);
  const [updatePart, { isLoading: isUpdating }] = useUpdatePartMutation();

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newFileList, setNewFileList] = useState([]);
  const [stockItemId, setStockItemId] = useState(null);

  // Populate form when data is fetched
  useEffect(() => {
    if (partData?.data) {
      const part = partData.data;

      form.setFieldsValue({
        title: part.title,
        code: part.code,
        description: part.description, // This now works perfectly with ReactQuill
        wholesale: part.price?.wholesale,
        wholesaleWithTenPercent: part.price?.wholesaleWithTenPercent,
        contractor: part.price?.contractor,
        assemblyPrice: part.assemblyPrice,
      });

      setExistingImages(part.images || []);
      setStockItemId(part.stockItemId?._id || part.stockItemId);
    }
  }, [partData, form]);

  const onFinish = async (values) => {
    // Optional: Extra safety check for description (though validator already handles it)
    const desc = values.description || "";
    const plainText = desc.replace(/<[^>]*>/g, "").trim();
    if (!plainText) {
      toast.error("Please enter a description");
      return;
    }

    // Check total images (existing remaining + new) don't exceed 8
    const totalImages = existingImages.length + newFileList.length;
    if (totalImages > 8) {
      toast.error("Total images cannot exceed 8");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("code", values.code);
      formData.append("description", desc);

      // Price object
      const priceObj = {
        wholesale: values.wholesale,
        wholesaleWithTenPercent: values.wholesaleWithTenPercent,
        contractor: values.contractor,
      };
      formData.append("price", JSON.stringify(priceObj));
      formData.append("assemblyPrice", values.assemblyPrice);

      // Deleted images
      if (deletedImages.length > 0) {
        formData.append("deletedImages", JSON.stringify(deletedImages));
      }

      // New images
      newFileList.forEach((file) => {
        formData.append("images", file.originFileObj || file);
      });

      const res = await updatePart({ data: formData, id: partId }).unwrap();
      toast.success(res?.message || "Part updated successfully");
      navigate(`/stock-items/details/${stockItemId}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update part");
    }
  };

  const handleDeleteExistingImage = (imagePath) => {
    setExistingImages((prev) => prev.filter((img) => img !== imagePath));
    setDeletedImages((prev) => [...prev, imagePath]);
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
          onClick={() => navigate(`/stock-items/details/${stockItemId}`)}
          className="text-gray-600 hover:text-primary"
        />
        <h2 className="text-xl font-semibold text-primary">Edit Part</h2>
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
                    alt={`Part image ${index + 1}`}
                    className="w-full h-32 object-cover rounded border"
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
            {existingImages.length + newFileList.length >= 8 ? null : (
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

        {/* Description - Now fully integrated with AntD Form */}
        <Form.Item
          label={
            <span className="text-base font-semibold">
              Description <span className="text-red-500">*</span>
            </span>
          }
          name="description"
          rules={[
            { required: true, message: "Please enter a description" },
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
              marginBottom: "60px",
            }}
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
                  message: "Please enter wholesale +10% price",
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
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-[#721011]"
              loading={isUpdating}
            >
              Update Part
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditParts;
