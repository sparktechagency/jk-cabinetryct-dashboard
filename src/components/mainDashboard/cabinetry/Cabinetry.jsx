import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Modal, Popconfirm, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeletecabinetryMutation,
  useGetAllCabinetryQuery,
} from "../../../redux/features/cabinetry/cabinetryApi";
import {
  useAddCabinetryCategoryMutation,
  useDeleteCabinetryCategoryMutation,
  useUpdateCabinetryCategoryMutation,
} from "../../../redux/features/cabinetryCategory/cabinetryCategory";
import toast from "react-hot-toast";

const Cabinetry = () => {
  const navigate = useNavigate();
  const { data: cabinetryData, isLoading, error } = useGetAllCabinetryQuery();
  const [addCategory, { isLoading: isAdding }] =
    useAddCabinetryCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCabinetryCategoryMutation();
  const [deleteCategory] = useDeleteCabinetryCategoryMutation();
  const [deleteCabinetry] = useDeletecabinetryMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.categoryName);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const res = await deleteCategory(categoryId).unwrap();
      toast.success(res?.message || "Category deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  const handleDeleteCabinetry = async (cabinetId, e) => {
    e.stopPropagation();
    try {
      const res = await deleteCabinetry(cabinetId).unwrap();
      toast.success(res?.message || "Cabinetry deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete cabinetry");
    }
  };

  const handleAddCabinet = (categoryId) => {
    navigate(`/cabinetry/add-cabinetry/${categoryId}`);
  };

  const handleCategorySubmit = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      const res = await addCategory({ name: categoryName }).unwrap();
      toast.success(res?.message || "Category added successfully");
      setIsAddModalOpen(false);
      setCategoryName("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add category");
    }
  };

  const handleCategoryUpdate = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      const res = await updateCategory({
        data: { name: categoryName },
        id: editingCategory.categoryId,
      }).unwrap();
      toast.success(res?.message || "Category updated successfully");
      setIsEditModalOpen(false);
      setCategoryName("");
      setEditingCategory(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update category");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white border rounded-xl flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white border rounded-xl">
        <div className="text-center text-red-500 py-8">
          Error loading cabinetry data. Please try again.
        </div>
      </div>
    );
  }

  const categories = cabinetryData?.data || [];

  return (
    <div className="w-full p-6 bg-white border rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/users")}
            className="text-gray-600 hover:text-primary"
          />
          <h2 className="text-2xl font-semibold text-primary">Cabinet list</h2>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAddCategory}
          loading={isAdding}
          className="flex items-center gap-2"
        >
          Add New Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No categories found. Please add a category to get started.
        </div>
      ) : (
        categories.map((category) => (
          <div key={category.categoryId} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-primary/80 font-semibold rounded text-white px-4 py-2 inline-flex items-center gap-3">
                <span>{category.categoryName}</span>
                <div className="flex gap-2">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditCategory(category)}
                    className="text-white hover:text-gray-200"
                  />
                  <Popconfirm
                    title="Delete Category"
                    description="Are you sure you want to delete this category? All cabinetry items will also be deleted."
                    onConfirm={() => handleDeleteCategory(category.categoryId)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      className="text-white hover:text-red-300"
                    />
                  </Popconfirm>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 border-t border-gray-200 py-3">
              {category.cabinetryDatas?.map((cabinet) => (
                <Card
                  key={cabinet._id}
                  cover={
                    <div className="relative rounded-t">
                      {cabinet.images && cabinet.images.length > 0 ? (
                        <img
                          src={`${cabinet.images[0]}`}
                          alt={cabinet.code}
                          className="w-full h-32 object-cover rounded-t"
                        />
                      ) : (
                        <div className="bg-gray-300 h-32 flex items-center justify-center">
                          <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400"></div>
                        </div>
                      )}
                      {/* Action Buttons on Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="primary"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() =>
                            navigate(`/cabinetry/edit-cabinetry/${cabinet._id}`)
                          }
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Delete Cabinetry"
                          description="Are you sure you want to delete this cabinetry?"
                          onConfirm={(e) =>
                            handleDeleteCabinetry(cabinet._id, e)
                          }
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  }
                  className="text-center hover:shadow-lg transition-shadow relative group"
                  bodyStyle={{ padding: "12px" }}
                >
                  <div className="text-sm font-medium">{cabinet.code}</div>
                  <div className="text-xs text-gray-600">{cabinet.color}</div>
                </Card>
              ))}

              <Card
                className="border-2 border-dashed border-gray-300 cursor-pointer hover:border-red-500 transition-colors"
                bodyStyle={{ padding: 0, height: "100%" }}
                onClick={() => handleAddCabinet(category.categoryId)}
              >
                <div className="h-full flex items-center justify-center min-h-[180px]">
                  <PlusOutlined className="text-3xl text-gray-400" />
                </div>
              </Card>
            </div>
          </div>
        ))
      )}

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          setCategoryName("");
        }}
        onOk={handleCategorySubmit}
        centered
        okText="Add Category"
        confirmLoading={isAdding}
      >
        <div className="py-4">
          <label className="block text-sm font-medium mb-2">
            Category Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter category name"
            size="large"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onPressEnter={handleCategorySubmit}
          />
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setCategoryName("");
          setEditingCategory(null);
        }}
        onOk={handleCategoryUpdate}
        centered
        okText="Update Category"
        confirmLoading={isUpdating}
      >
        <div className="py-4">
          <label className="block text-sm font-medium mb-2">
            Category Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter category name"
            size="large"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onPressEnter={handleCategoryUpdate}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Cabinetry;
