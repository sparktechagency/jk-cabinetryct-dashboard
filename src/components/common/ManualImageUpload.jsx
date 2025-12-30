/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const MAX_FILES = 20; // Match backend limit
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ManualImageUpload = ({
  mainImage,
  setMainImage,
  otherImages,
  setOtherImages,
  setDeletedImages = () => {},
  maxOtherImages = MAX_FILES,
  showMainImage = true,
  showOtherImages = true,
  labelMainImage = "Upload Main Image",
  labelOtherImages = "Upload Other Images",
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic,image/heif",
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Validate file before upload
  const validateFile = useCallback((file) => {
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

    return true;
  }, []);

  // Handle main image upload
  const handleMainImageUpload = useCallback(
    (file) => {
      if (!validateFile(file)) {
        return false; // Prevent upload
      }

      // Convert file to object URL for preview
      const fileWithPreview = {
        ...file,
        preview: URL.createObjectURL(file),
        uid: file.uid || Date.now(),
      };

      setMainImage(fileWithPreview);
      return false; // Prevent auto upload
    },
    [validateFile, setMainImage]
  );

  // Handle other images upload
  const handleOtherImagesUpload = useCallback(
    (file) => {
      if (!validateFile(file)) {
        return false; // Prevent upload
      }

      if (otherImages.length >= maxOtherImages) {
        toast.error(`Maximum ${maxOtherImages} files allowed`);
        return false;
      }

      // Convert file to object URL for preview
      const fileWithPreview = {
        ...file,
        preview: URL.createObjectURL(file),
        uid: file.uid || Date.now(),
      };

      setOtherImages((prev) => [...prev, fileWithPreview]);
      return false; // Prevent auto upload
    },
    [validateFile, otherImages.length, maxOtherImages, setOtherImages]
  );

  // Remove main image
  const handleRemoveMainImage = useCallback(() => {
    if (mainImage && mainImage.url) {
      // If it's an existing image (has URL), add to deleted images
      setDeletedImages((prev) => [...prev, mainImage.url]);
    }
    setMainImage(null);
  }, [mainImage, setDeletedImages, setMainImage]);

  // Remove other image
  const handleRemoveOtherImage = useCallback(
    (index) => {
      const imageToRemove = otherImages[index];

      if (imageToRemove.url) {
        // If it's an existing image (has URL), add to deleted images
        setDeletedImages((prev) => [...prev, imageToRemove.url]);
      }

      setOtherImages((prev) => prev.filter((_, i) => i !== index));
    },
    [otherImages, setDeletedImages, setOtherImages]
  );

  // Handle preview
  const handlePreview = useCallback((image) => {
    setPreviewImage(image.preview || image.url);
    setPreviewVisible(true);
  }, []);

  // Handle file drop
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          handleOtherImagesUpload(file);
        }
      });
    },
    [handleOtherImagesUpload]
  );

  // Clean up object URLs to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (mainImage && mainImage.preview) {
        URL.revokeObjectURL(mainImage.preview);
      }
      otherImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [mainImage, otherImages]);

  return (
    <div className="manual-image-upload">
      {/* Main Image Upload */}
      {showMainImage && (
        <div className="mb-6">
          <label className="block text-base font-semibold mb-3">
            {labelMainImage}{" "}
            {mainImage && <span className="text-red-500">*</span>}
          </label>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Main Image Preview */}
            {mainImage && (
              <div className="relative group flex-shrink-0">
                <img
                  src={mainImage.preview || mainImage.url}
                  alt="Main Preview"
                  className="w-auto max-w-56 h-56  object-cover rounded border border-gray-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                  <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(mainImage)}
                    className="mr-2"
                  >
                    Preview
                  </Button>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveMainImage}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex-1">
              <Upload
                beforeUpload={handleMainImageUpload}
                accept={accept}
                maxCount={1}
                showUploadList={false}
                onDrop={onDrop}
                className="w-full"
              >
                <Button
                  type="dashed"
                  className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary"
                >
                  <UploadOutlined className="text-xl mb-2" />
                  <div>Click or drag file to upload</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Max 50MB, JPG/PNG/GIF/WEBP/HEIC/HEIF
                  </div>
                </Button>
              </Upload>
              {mainImage && (
                <div className="text-xs text-gray-500 mt-2">
                  Main image uploaded: {mainImage.name || "Image"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other Images Upload */}
      {showOtherImages && (
        <div className="mb-6">
          <label className="block text-base font-semibold mb-3">
            {labelOtherImages} ({otherImages.length} / {maxOtherImages})
          </label>

          {/* Existing Other Images Preview */}
          {otherImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {otherImages.map((image, index) => (
                <div key={image.uid || index} className="relative group">
                  <img
                    src={image.preview || image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded border border-gray-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                    <Button
                      type="primary"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(image)}
                      className="mr-1"
                    />
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveOtherImage(index)}
                    />
                  </div>
                  {image.name && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {image.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Button for Other Images */}
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
          >
            <Upload
              beforeUpload={handleOtherImagesUpload}
              accept={accept}
              multiple
              showUploadList={false}
              className="w-full"
            >
              <Button
                type="dashed"
                disabled={otherImages.length >= maxOtherImages}
                className="w-full flex flex-col items-center justify-center border-0 hover:border-primary"
              >
                <UploadOutlined className="text-xl mb-2" />
                <div>
                  {otherImages.length >= maxOtherImages
                    ? "Maximum images reached"
                    : "Click or drag files to upload"}
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  Max 50MB each, JPG/PNG/GIF/WEBP/HEIC/HEIF
                </div>
              </Button>
            </Upload>
            <div className="text-xs text-gray-500 -mt-1">
              {otherImages.length} / {maxOtherImages} images selected
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreviewVisible(false)}
        >
          <div className="relative max-w-4xl max-h-4xl p-4">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualImageUpload;
