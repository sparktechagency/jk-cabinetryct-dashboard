import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleCollectionQuery,
  useUpdateCollectionMutation,
} from "../../../redux/features/collection/collectionApi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ManualImageUpload from "../../../components/common/ManualImageUpload";

const MAX_FILES = 20; // Match backend limit

const EditCollection = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { collectionId } = useParams();

  const { data: collectionData, isLoading: isFetching } =
    useGetSingleCollectionQuery(collectionId);
  const [updateCollection, { isLoading }] = useUpdateCollectionMutation();

  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingOtherImages, setExistingOtherImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newMainImage, setNewMainImage] = useState(null);
  const [newOtherImages, setNewOtherImages] = useState([]);

  useEffect(() => {
    if (collectionData?.data) {
      const collection = collectionData.data;
      form.setFieldsValue({
        code: collection.code,
        colorName: collection.color,
        description: collection.description,
      });

      // Handle main image and other images separately
      if (collection.mainImage) {
        setExistingMainImage(collection.mainImage);
      }
      if (collection.images && Array.isArray(collection.images)) {
        setExistingOtherImages(collection.images);
      }
    }
  }, [collectionData, form]);

  const onFinish = async (values) => {
    // Calculate total other images
    const totalOtherImages = existingOtherImages.length + newOtherImages.length;

    if (!existingMainImage && !newMainImage) {
      toast.error("Please keep at least one main image");
      return;
    }

    if (totalOtherImages > MAX_FILES) {
      toast.error(`Total other images cannot exceed ${MAX_FILES}`);
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

      // Add new main image
      if (newMainImage) {
        formData.append(
          "mainImage",
          newMainImage.originFileObj || newMainImage
        );
      }

      // Add new other images
      newOtherImages.forEach((file) => {
        formData.append("images", file.originFileObj || file);
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

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const totalOtherImages = existingOtherImages.length + newOtherImages.length;
  const totalImages =
    (existingMainImage ? 1 : 0) + totalOtherImages + (newMainImage ? 1 : 0);

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

        {/* Image Upload Section */}
        <ManualImageUpload
          mainImage={newMainImage || (existingMainImage ? { url: existingMainImage, name: 'existing-main-image' } : null)}
          setMainImage={(image) => {
            if (image && image.url && image.name === 'existing-main-image') {
              // This is an existing image that was re-added, keep it as existing
              setExistingMainImage(image.url);
              setNewMainImage(null);
            } else if (image === null) {
              // Image was removed
              if (existingMainImage) {
                // If it was an existing image, add to deleted images
                setDeletedImages(prev => [...prev, existingMainImage]);
                setExistingMainImage(null);
              }
              setNewMainImage(null);
            } else {
              // New image uploaded
              setNewMainImage(image);
              // If we're replacing an existing main image with a new one,
              // the existing one should be marked for deletion
              if (existingMainImage && !deletedImages.includes(existingMainImage)) {
                setDeletedImages(prev => [...prev, existingMainImage]);
                setExistingMainImage(null);
              }
            }
          }}
          otherImages={[...existingOtherImages.map(img => ({ url: img, name: 'existing' })), ...newOtherImages]}
          setOtherImages={(images) => {
            // Separate existing and new images
            const existingImgs = images.filter(img => img.url && img.name === 'existing');
            const newImgs = images.filter(img => !img.url || !img.name || img.name !== 'existing');

            // Check for deleted existing images
            const currentExistingUrls = existingOtherImages;
            const newExistingUrls = existingImgs.map(img => img.url);

            // Find which existing images were removed
            const removedExisting = currentExistingUrls.filter(url => !newExistingUrls.includes(url));
            if (removedExisting.length > 0) {
              setDeletedImages(prev => [...prev, ...removedExisting]);
            }

            setExistingOtherImages(newExistingUrls);
            setNewOtherImages(newImgs);
          }}
          deletedImages={deletedImages}
          setDeletedImages={setDeletedImages}
          maxOtherImages={MAX_FILES}
          showMainImage={true}
          showOtherImages={true}
          labelMainImage="Upload Main Image"
          labelOtherImages="Upload Other Images"
        />

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
