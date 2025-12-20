import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Avatar,
  Modal,
  Badge,
  Divider,
  Select,
  Input,
  Spin,
  message,
  Image,
} from "antd";
import {
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CreditCardOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useGetOrdersQuery } from "../../../redux/features/order/getOrder";
import { useUpdateOrderStatusMutation } from "../../../redux/features/order/updateStatus";
import dayjs from "dayjs";

const OrderStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const Order = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: ordersData, isLoading } = useGetOrdersQuery({
    searchTerm,
    status: selectedTab,
  });
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orders = ordersData?.data || [];

  const handleViewOrder = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      message.success("Order status updated successfully");
    } catch (error) {
      message.error(error?.data?.message || "Failed to update order status");
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: { text: "Pending", color: "orange" },
      confirmed: { text: "Confirmed", color: "cyan" },
      processing: { text: "Processing", color: "blue" },
      shipped: { text: "Shipped", color: "purple" },
      delivered: { text: "Delivered", color: "green" },
      cancelled: { text: "Cancelled", color: "red" },
    };
    return config[status] || { text: "Unknown", color: "default" };
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    const parts = [
      address.address,
      address.addressLine2,
      `${address.city}, ${address.state}`,
      `${address.country} - ${address.zipCode}`,
    ].filter(Boolean);
    return parts.join("\n");
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Order Placed",
      dataIndex: "createdAt",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Items",
      dataIndex: "items",
      render: (items) => (
        <span className="flex items-center gap-2">{items?.length || 0}</span>
      ),
    },
    {
      title: "Shipping",
      dataIndex: "shippingCost",
      render: (cost) => (
        <Tag color={cost > 0 ? "green" : "default"}>
          {cost > 0 ? `$${cost.toFixed(2)}` : "Free"}
        </Tag>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (p) => (
        <span className="text-sm font-semibold text-primary">
          ${p?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      title: "Customer",
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-primary">
            {r.userId?.firstName?.[0] || "U"}
          </Avatar>
          <div>
            <span className="font-medium block">
              {r.userId?.firstName} {r.userId?.lastName}
            </span>
            <span className="text-xs text-gray-500">{r.userId?.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Branch",
      render: (_, r) => (
        <div className="text-xs text-gray-600">
          <div className="font-medium">{r.branchId?.name || "N/A"}</div>
          <div>{r.branchId?.email}</div>
        </div>
      ),
    },
    {
      title: "Status",
      render: (_, r) => {
        return (
          <Select
            value={r.status}
            style={{ width: 130 }}
            loading={isUpdating}
            onChange={(value) => handleStatusChange(r._id, value)}
            options={[
              { value: OrderStatus.PENDING, label: "Pending" },
              { value: OrderStatus.CONFIRMED, label: "Confirmed" },
              { value: OrderStatus.PROCESSING, label: "Processing" },
              { value: OrderStatus.SHIPPED, label: "Shipped" },
              { value: OrderStatus.DELIVERED, label: "Delivered" },
              { value: OrderStatus.CANCELLED, label: "Cancelled" },
            ]}
          />
        );
      },
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="w-full p-6 bg-white border rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Order List</h2>
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b mb-6">
          {[
            "all",
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`pb-3 px-1 border-b-2 font-medium capitalize transition-all ${
                selectedTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "all" ? "All" : tab}
            </button>
          ))}
        </div>

        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
              total: ordersData?.meta?.totalResult,
            }}
            rowClassName="hover:bg-gray-50"
          />
        </Spin>
      </div>

      {/* View Order Modal */}
      <Modal
        title={
          <span className="text-xl font-bold">
            Order Details - {selectedOrder?.orderNumber}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
        centered
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div>
                <Badge
                  status="processing"
                  text={
                    <span className="font-medium">
                      Order Placed:{" "}
                      {dayjs(selectedOrder.createdAt).format(
                        "MMM DD, YYYY hh:mm A"
                      )}
                    </span>
                  }
                />
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span>
                    <strong>Items:</strong> {selectedOrder.items?.length || 0}
                  </span>
                  <span>
                    <strong>Branch:</strong>{" "}
                    {selectedOrder.branchId?.name || "N/A"}
                  </span>
                </div>
              </div>
              <Tag
                color={getStatusConfig(selectedOrder.status).color}
                className="text-lg px-4 py-1"
              >
                {getStatusConfig(selectedOrder.status).text}
              </Tag>
            </div>

            <Divider />

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <HomeOutlined /> Shipping Address
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">
                    {selectedOrder.shippingAddress?.firstName}{" "}
                    {selectedOrder.shippingAddress?.lastName}
                  </p>
                  {selectedOrder.shippingAddress?.companyName && (
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress.companyName}
                    </p>
                  )}
                  <p className="text-gray-600 whitespace-pre-line">
                    {formatAddress(selectedOrder.shippingAddress)}
                  </p>
                  <div className="mt-3 space-y-1 text-sm">
                    <span className="flex items-center gap-1">
                      <PhoneOutlined />{" "}
                      {selectedOrder.shippingAddress?.phoneNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <MailOutlined /> {selectedOrder.shippingAddress?.email}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CreditCardOutlined /> Order Summary
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shippingCost?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total:</span>
                    <span>${selectedOrder.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                    <strong>Notes:</strong> {selectedOrder.notes}
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Order Items</h3>
              <Table
                dataSource={selectedOrder.items}
                rowKey={(item) => item.partsId?._id}
                pagination={false}
                columns={[
                  {
                    title: "Image",
                    dataIndex: ["partsId", "images"],
                    width: 80,
                    render: (images) => (
                      <Image
                        src={
                          images?.[0]
                            ? `${import.meta.env.VITE_BASE_URL}${images[0]}`
                            : "/placeholder.png"
                        }
                        alt="Product"
                        width={50}
                        height={50}
                        className="object-cover rounded"
                        fallback="/placeholder.png"
                      />
                    ),
                  },
                  {
                    title: "Item Name",
                    render: (_, item) => (
                      <div>
                        <div className="font-medium">
                          {item.partsId?.title || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Code: {item.partsId?.code}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Unit Price",
                    render: (_, item) => (
                      <span>
                        ${item.partsId?.price?.wholesale?.toFixed(2) || "0.00"}
                      </span>
                    ),
                    align: "right",
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    width: 100,
                    align: "center",
                  },
                  {
                    title: "Total",
                    dataIndex: "totalPrice",
                    render: (p) => (
                      <span className="font-medium">${p?.toFixed(2)}</span>
                    ),
                    align: "right",
                  },
                ]}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={4} className="font-bold text-right">
                      Subtotal
                    </Table.Summary.Cell>
                    <Table.Summary.Cell className="font-bold text-right text-green-600">
                      ${selectedOrder.subtotal?.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </div>

            {/* Created By Info */}
            <div className="text-sm text-gray-500 mt-4">
              <strong>Created By:</strong> {selectedOrder.createdBy?.firstName}{" "}
              {selectedOrder.createdBy?.lastName} (
              {selectedOrder.createdBy?.email})
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Order;
