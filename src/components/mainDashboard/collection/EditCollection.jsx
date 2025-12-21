import {
  ArrowLeftOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleCollectionQuery,
  useUpdateCollectionMutation,
} from "../../../redux/features/collection/collectionApi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MAX_FILES = 20; // Match backend limit
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const EditCollection = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { collectionId } = useParams();

  const { data: collectionData, isLoading: isFetching } =
    useGetSingleCollectionQuery(collectionId);
  const [updateCollection, { isLoading }] = useUpdateCollectionMutation();

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newFileList, setNewFileList] = useState([]);

  useEffect(() => {
    if (collectionData?.data) {
      const collection = collectionData.data;
      form.setFieldsValue({
        code: collection.code,
        colorName: collection.color,
        description: collection.description,
      });
      setExistingImages(collection.images || []);
    }
  }, [collectionData, form]);

  const onFinish = async (values) => {
    // Calculate total images
    const totalImages = existingImages.length + newFileList.length;

    if (totalImages === 0) {
      toast.error("Please keep at least one image");
      return;
    }

    if (totalImages > MAX_FILES) {
      toast.error(`Total images cannot exceed ${MAX_FILES}`);
      return;
    }

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

      console.log("Submitting update:", {
        existingImages: existingImages.length,
        deletedImages: deletedImages.length,
        newImages: newFileList.length,
        totalFinalImages: existingImages.length + newFileList.length,
      });

      const res = await updateCollection({
        data: formData,
        id: collectionId,
      }).unwrap();

      toast.success(res?.message || "Collection updated successfully");
      navigate("/collection");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update collection");
    }
  };

  const handleDeleteExistingImage = (imagePath) => {
    const remainingImages = existingImages.length - 1;
    const totalAfterDelete = remainingImages + newFileList.length;

    if (totalAfterDelete === 0) {
      toast.error("At least one image is required");
      return;
    }

    setExistingImages(existingImages.filter((img) => img !== imagePath));
    setDeletedImages([...deletedImages, imagePath]);
    toast.info("Image marked for deletion");
  };

  const handleNewUpload = ({ fileList: newFiles }) => {
    const totalImages = existingImages.length + newFiles.length;

    if (totalImages > MAX_FILES) {
      toast.error(`Total images cannot exceed ${MAX_FILES}`);
      return;
    }

    // Validate each new file size
    const oversizedFiles = newFiles.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      toast.error(
        `File size should not exceed 50MB. Found ${oversizedFiles.length} oversized file(s)`
      );
      return;
    }

    setNewFileList(newFiles);
  };

  const handleRemoveNewImage = (file) => {
    setNewFileList(newFileList.filter((item) => item.uid !== file.uid));
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

    // Check total file count
    const totalAfterUpload = existingImages.length + newFileList.length + 1;
    if (totalAfterUpload > MAX_FILES) {
      toast.error(`Total images cannot exceed ${MAX_FILES}`);
      return false;
    }

    return false; // Prevent auto upload
  };

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const totalImages = existingImages.length + newFileList.length;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/collection")}
          className="text-gray-600 hover:text-primary"
        />
        <h2 className="text-xl font-semibold text-primary">Edit Collection</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Image Count Summary */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Total Images:</strong> {totalImages} / {MAX_FILES}
            {deletedImages.length > 0 && (
              <span className="ml-3 text-red-600">
                ({deletedImages.length} marked for deletion)
              </span>
            )}
          </p>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-6">
            <label className="block text-base font-semibold mb-3">
              Existing Images ({existingImages.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {existingImages.map((imagePath, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imagePath}
                    alt={`Collection ${index + 1}`}
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
            <span className="text-base font-semibold">
              Upload New Photos{" "}
              {newFileList.length > 0 && `(${newFileList.length})`}
            </span>
          }
        >
          <Upload
            listType="picture-card"
            fileList={newFileList}
            onChange={handleNewUpload}
            beforeUpload={beforeUpload}
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic,image/heif"
            onRemove={handleRemoveNewImage}
            maxCount={MAX_FILES}
          >
            {totalImages >= MAX_FILES ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <div className="text-xs text-gray-500 mt-2">
            Maximum {MAX_FILES} images total. Maximum file size: 50MB. Supported
            formats: JPG, PNG, GIF, WEBP, HEIC, HEIF
          </div>
          {totalImages >= MAX_FILES && (
            <div className="text-sm text-orange-600 mt-2">
              ⚠️ Maximum image limit reached. Delete existing images to add new
              ones.
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
            placeholder="Write a description about the collection..."
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
              size="large"
              onClick={() => navigate("/collection")}
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

export default EditCollection;
