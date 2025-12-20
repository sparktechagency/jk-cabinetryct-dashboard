import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddStockItemMutation,
  useDeleteStockItemMutation,
  useGetAllStockItemsQuery,
  useUpdateStockItemMutation,
} from "../../../redux/features/stockItem/stockItem";
import toast from "react-hot-toast";

const StockItem = () => {
  const { data: stockItemsData, isLoading } = useGetAllStockItemsQuery();
  const [addStockItem, { isLoading: isAdding }] = useAddStockItemMutation();
  const [updateStockItem, { isLoading: isUpdating }] =
    useUpdateStockItemMutation();
  const [deleteStockItem] = useDeleteStockItemMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const stockItems = stockItemsData?.data || [];

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({ name: item.title });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const item = stockItems.find((i) => i._id === id);
    Modal.confirm({
      title: "Delete Category?",
      content: `Are you sure you want to delete "${item.title}"? All related titles and parts will be deleted.`,
      okText: "Delete",
      centered: true,
      okType: "danger",
      onOk: async () => {
        try {
          const res = await deleteStockItem(id).unwrap();
          toast.success(res?.message || "Deleted successfully");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete");
        }
      },
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const trimmedName = values.name.trim();

      if (!editingItem) {
        // Add New
        const res = await addStockItem({ name: trimmedName }).unwrap();
        toast.success(res?.message || "Stock Item added successfully!");
      } else {
        // Update
        const res = await updateStockItem({
          data: { title: trimmedName },
          id: editingItem._id,
        }).unwrap();
        toast.success(res?.message || "Updated successfully!");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      }
    }
  };

  const handleStockItemClick = (stockItemId) => {
    navigate(`/stock-items/details/${stockItemId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 mx-auto bg-white border border-gray-200 rounded-xl shadow-sm flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full p-6 mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-primary"
        />
        <h2 className="text-xl font-semibold text-primary">Stock Item</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stockItems?.map((item) => (
          <div
            key={item._id}
            className="group relative bg-gray-50 hover:bg-gray-100 rounded-lg px-5 py-4 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-200 "
            onClick={() => handleStockItemClick(item?._id)}
          >
            <span className=" font-medium text-base">{item?.name}</span>

            <div
              className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="text"
                size="middle"
                icon={<EditOutlined className="text-blue-600" />}
                onClick={() => handleEdit(item)}
              />
              <Button
                type="text"
                size="middle"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          </div>
        ))}

        {/* Add New Button */}
        <button
          onClick={handleAdd}
          className="border border-primary rounded-lg px-5 py-4 flex items-center gap-2 justify-center text-primary hover:bg-red-50 transition-all duration-200 group"
        >
          <PlusOutlined className="text-lg  group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Add New</span>
        </button>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingItem ? "Edit Stock Item" : "Add New Stock Item"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          form.resetFields();
        }}
        okText={editingItem ? "Update" : "Add"}
        cancelText="Cancel"
        centered
        confirmLoading={isAdding || isUpdating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Stock Item Title"
            rules={[
              { required: true, message: "Please enter title" },
              { min: 3, message: "At least 3 characters" },
            ]}
          >
            <Input placeholder="e.g. Bases & Drawers Cabinets" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockItem;
