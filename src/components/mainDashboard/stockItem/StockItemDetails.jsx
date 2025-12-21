import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Form,
  Input,
  Modal,
  Popconfirm,
  Spin,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeletePartMutation,
  useGetAllPartsQuery,
} from "../../../redux/features/parts/partsApi";
import {
  useAddStockItemTitleMutation,
  useDeleteStockItemTitleMutation,
  useUpdateStockItemTitleMutation,
} from "../../../redux/features/stockItemTitle/stockItemTitle";
import toast from "react-hot-toast";

const StockItemDetails = () => {
  const { stockItemId } = useParams();
  const navigate = useNavigate();
  const { data: responseData, isLoading } = useGetAllPartsQuery(stockItemId, {
    skip: !stockItemId,
  });
  const [addTitle, { isLoading: isAddingTitle }] =
    useAddStockItemTitleMutation();
  const [updateTitle, { isLoading: isUpdatingTitle }] =
    useUpdateStockItemTitleMutation();
  const [deleteTitle] = useDeleteStockItemTitleMutation();
  const [deletePart] = useDeletePartMutation();

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isEditTitleModalOpen, setIsEditTitleModalOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(null);

  const [titleForm] = Form.useForm();

  // Get data from response - Fixed field names
  const stockItemName = responseData?.data?.[0]?.stockItemName;
  const titles = responseData?.data?.[0]?.titles || [];

  // Add Title
  const handleAddTitle = () => {
    titleForm.resetFields();
    setIsTitleModalOpen(true);
  };

  const handleSaveTitle = async () => {
    try {
      const values = await titleForm.validateFields();
      const res = await addTitle({
        title: values.titleName,
        stockItemId: stockItemId,
      }).unwrap();
      toast.success(res?.message || "Title added successfully!");
      setIsTitleModalOpen(false);
      titleForm.resetFields();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add title");
    }
  };

  // Edit Title - Fixed to use titleName
  const handleEditTitle = (title) => {
    setEditingTitle(title);
    titleForm.setFieldsValue({ titleName: title.titleName }); // Changed from title.stockItemTitle
    setIsEditTitleModalOpen(true);
  };

  const handleUpdateTitle = async () => {
    try {
      const values = await titleForm.validateFields();
      const res = await updateTitle({
        data: { title: values.titleName },
        id: editingTitle.titleId, // Changed from stockItemTitleId
      }).unwrap();
      toast.success(res?.message || "Title updated successfully!");
      setIsEditTitleModalOpen(false);
      setEditingTitle(null);
      titleForm.resetFields();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update title");
    }
  };

  // Delete Title - Fixed to use titleId
  const handleDeleteTitle = async (titleId) => {
    try {
      const res = await deleteTitle(titleId).unwrap();
      toast.success(res?.message || "Title deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete title");
    }
  };

  // Parts Handlers
  const handleAddPart = (titleId) => {
    navigate(`/stock-items/add-part/${stockItemId}/${titleId}`);
  };

  const handleEditPart = (partId) => {
    navigate(`/stock-items/edit-part/${partId}`);
  };

  const handleDeletePart = async (partId, e) => {
    e.stopPropagation();
    try {
      const res = await deletePart(partId).unwrap();
      toast.success(res?.message || "Part deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete part");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white rounded-xl border p-6 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  console.log("Response Data:", responseData);
  console.log("Stock Item Name:", stockItemName);
  console.log("Titles:", titles);

  return (
    <div className="w-full min-h-screen bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/stock-items")}
            className="text-gray-600 hover:text-primary"
          />
          <h1 className="text-2xl font-bold text-primary">
            {stockItemName || "Stock Item Details"}
          </h1>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAddTitle}
          className="bg-[#721011]"
        >
          Add New Title
        </Button>
      </div>

      {titles?.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No titles found. Please add a title to get started.
        </div>
      ) : (
        titles?.map((title) => (
          <div key={title?.titleId} className="mb-12">
            {/* Title Header with Edit/Delete - Fixed to use titleName */}
            <div className="flex items-center justify-between mb-3">
              <div className="bg-primary/80 font-semibold rounded text-white px-4 py-2 inline-flex items-center gap-3">
                <span>{title?.titleName}</span>{" "}
                {/* Changed from title?.title */}
                <div className="flex gap-2">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditTitle(title)}
                    className="text-white hover:text-gray-200"
                  />
                  <Popconfirm
                    title="Delete Title"
                    description="Are you sure? All parts under this title will be deleted."
                    onConfirm={() => handleDeleteTitle(title.titleId)} // Changed from stockItemTitleId
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

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-gray-200 py-3 gap-6">
              {title?.parts?.length > 0 ? (
                title.parts.map((item) => (
                  <Card
                    key={item._id}
                    className="shadow transition-shadow rounded-xl group relative"
                    bodyStyle={{ padding: "16px" }}
                  >
                    <div className="relative">
                      {item.images && item.images.length > 0 ? (
                        <Carousel
                          autoplay
                          autoplaySpeed={3000}
                          className="rounded-xl mb-4 overflow-hidden"
                        >
                          {item.images.map((image, index) => (
                            <div key={index} className="w-full h-56">
                              <img
                                src={`${image}`}
                                alt={`${item.code} - ${index + 1}`}
                                className="w-full h-56 object-cover"
                              />
                            </div>
                          ))}
                        </Carousel>
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4 flex items-center justify-center">
                          <span className="text-4xl text-gray-400">
                            No Image
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay with Edit and Delete Buttons */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl mb-4">
                        <Button
                          type="primary"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditPart(item._id)}
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Delete Part"
                          description="Are you sure you want to delete this part?"
                          onConfirm={(e) => handleDeletePart(item._id, e)}
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

                    <h4 className="font-bold text-gray-800">{item.code}</h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />

                    <h1 className="text-base font-semibold mt-5 mb-2 text-primary">
                      Price Details:
                    </h1>
                    <div className="space-y-1 grid grid-cols-2 gap-3">
                      <p className="text-base ">
                        Wholesale: ${item.price?.wholesale || 0}
                      </p>
                      <p className="text-base text-gray-500">
                        With 10%: ${item.price?.wholesaleWithTenPercent || 0}
                      </p>
                      <p className="text-base text-gray-500">
                        Contractor: ${item.price?.contractor || 0}
                      </p>
                      <p className="text-base text-gray-500">
                        Assembly: ${item?.assemblyPrice || 0}
                      </p>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No parts found under this title. Click the + button to add a
                  part.
                </div>
              )}

              {/* Add Item Card */}
              <div
                onClick={() => handleAddPart(title?.titleId)}
                className="border border-gray-400 rounded-xl h-96 md:h-[445px] flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/10 transition-all group"
              >
                <div className="text-center rounded-full size-10 flex justify-center items-center border-2 border-primary p-1">
                  <PlusOutlined className="text-xl text-primary" />
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Add Title Modal */}
      <Modal
        title="Add New Title"
        open={isTitleModalOpen}
        onOk={handleSaveTitle}
        onCancel={() => {
          setIsTitleModalOpen(false);
          titleForm.resetFields();
        }}
        okText="Add Title"
        centered
        confirmLoading={isAddingTitle}
      >
        <Form form={titleForm} layout="vertical">
          <Form.Item
            name="titleName"
            label="Title Name"
            rules={[
              { required: true, message: "Please enter title name" },
              { min: 3, message: "At least 3 characters" },
            ]}
          >
            <Input placeholder="e.g. SA Base Cabinet" size="large" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Title Modal */}
      <Modal
        title="Edit Title"
        open={isEditTitleModalOpen}
        onOk={handleUpdateTitle}
        onCancel={() => {
          setIsEditTitleModalOpen(false);
          setEditingTitle(null);
          titleForm.resetFields();
        }}
        okText="Update Title"
        centered
        confirmLoading={isUpdatingTitle}
      >
        <Form form={titleForm} layout="vertical">
          <Form.Item
            name="titleName"
            label="Title Name"
            rules={[
              { required: true, message: "Please enter title name" },
              { min: 3, message: "At least 3 characters" },
            ]}
          >
            <Input placeholder="e.g. SA Base Cabinet" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockItemDetails;
