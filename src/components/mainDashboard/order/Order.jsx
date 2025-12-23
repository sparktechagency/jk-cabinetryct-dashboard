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
  Form,
  Card,
  Descriptions,
} from "antd";
import {
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CreditCardOutlined,
  SearchOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useGetOrdersQuery } from "../../../redux/features/order/getOrder";
import { useUpdateOrderStatusMutation } from "../../../redux/features/order/updateStatus";
import dayjs from "dayjs";
import { useSendPaymentLinkOrderMutation } from "../../../redux/features/order/sendPaymentLinkOrder";

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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: ordersData, isLoading } = useGetOrdersQuery({
    searchTerm,
    status: selectedTab,
  });
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [sendPaymentLink, { isLoading: isSendingPayment }] =
    useSendPaymentLinkOrderMutation();

  const orders = ordersData?.data || [];

  const handleViewOrder = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const handleOpenPaymentModal = (record) => {
    form.setFieldsValue({
      orderNumber: record.orderNumber,
      orderId: record._id,
      payableAmount: record.totalPrice?.toFixed(2) || "0.00",
      paymentLink: "",
    });
    setIsPaymentModalOpen(true);
  };

  const handleSendPaymentLink = async () => {
    try {
      const values = await form.validateFields();

      await sendPaymentLink({
        orderId: values.orderId,
        payableAmount: Number(values.payableAmount),
        paymentLink: values.paymentLink,
      }).unwrap();

      message.success("Payment link sent successfully");
      setIsPaymentModalOpen(false);
      form.resetFields();
    } catch (error) {
      if (error.errorFields) {
        message.error("Please fill all required fields");
      } else {
        message.error(error?.data?.message || "Failed to send payment link");
      }
    }
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

  const calculateItemTotal = (item) => {
    const basePrice = item.partsId?.price?.wholesale || 0;
    const assemblyPrice = item.isAssemblyPrice
      ? item.partsId?.assemblyPrice || 0
      : 0;
    const pricePerUnit = basePrice + assemblyPrice;
    return pricePerUnit * item.quantity;
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
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (p) => (
        <span className="text-sm font-semibold text-primary">
          ${p?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      title: "Payment Info",
      render: (_, r) => {
        if (!r.isPaymentLinkSent || !r.paymentDetails) {
          return (
            <Tag color="default" icon={<CloseCircleOutlined />}>
              Not Sent
            </Tag>
          );
        }

        return (
          <div className="space-y-1">
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Link Sent
            </Tag>
            <div className="text-xs text-gray-600">
              Amount: ${r.paymentDetails.payableAmount?.toFixed(2) || "0.00"}
            </div>
          </div>
        );
      },
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
      title: "Status",
      render: (_, r) => {
        const getAvailableStatuses = (currentStatus) => {
          switch (currentStatus) {
            case OrderStatus.PENDING:
              return [
                { value: OrderStatus.PENDING, label: "Pending" },
                { value: OrderStatus.CONFIRMED, label: "Confirmed" },
              ];
            case OrderStatus.CONFIRMED:
              return [
                { value: OrderStatus.CONFIRMED, label: "Confirmed" },
                { value: OrderStatus.PROCESSING, label: "Processing" },
              ];
            case OrderStatus.PROCESSING:
              return [
                { value: OrderStatus.PROCESSING, label: "Processing" },
                { value: OrderStatus.SHIPPED, label: "Shipped" },
              ];
            case OrderStatus.SHIPPED:
              return [
                { value: OrderStatus.SHIPPED, label: "Shipped" },
                { value: OrderStatus.DELIVERED, label: "Delivered" },
              ];
            case OrderStatus.DELIVERED:
              return [{ value: OrderStatus.DELIVERED, label: "Delivered" }];
            case OrderStatus.CANCELLED:
              return [{ value: OrderStatus.CANCELLED, label: "Cancelled" }];
            default:
              return [
                { value: OrderStatus.PENDING, label: "Pending" },
                { value: OrderStatus.CONFIRMED, label: "Confirmed" },
                { value: OrderStatus.PROCESSING, label: "Processing" },
                { value: OrderStatus.SHIPPED, label: "Shipped" },
                { value: OrderStatus.DELIVERED, label: "Delivered" },
                { value: OrderStatus.CANCELLED, label: "Cancelled" },
              ];
          }
        };

        return (
          <Select
            value={r.status}
            style={{ width: 130 }}
            loading={isUpdating}
            onChange={(value) => handleStatusChange(r._id, value)}
            options={getAvailableStatuses(r.status)}
          />
        );
      },
    },
    {
      title: "Send Payment Link",
      render: (_, record) => (
        <Space className="flex justify-center">
          <Button
            type="text"
            icon={<SendOutlined />}
            onClick={() => handleOpenPaymentModal(record)}
            className="bg-primary text-white p-2"
            disabled={record.isPaymentLinkSent}
            title={
              record.isPaymentLinkSent
                ? "Payment link already sent"
                : "Send payment link"
            }
          />
        </Space>
      ),
    },
    {
      title: "View Order",
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
        width={1000}
        centered
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
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

            {/* Payment Details Card */}
            {selectedOrder.isPaymentLinkSent &&
              selectedOrder.paymentDetails && (
                <>
                  <Card
                    title={
                      <span className="flex items-center gap-2">
                        <DollarOutlined /> Payment Details
                      </span>
                    }
                    bordered={false}
                    className="bg-green-50"
                  >
                    <Descriptions column={2} size="small">
                      <Descriptions.Item label="Payable Amount">
                        <span className="font-bold text-green-600">
                          $
                          {selectedOrder.paymentDetails.payableAmount?.toFixed(
                            2
                          )}
                        </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="Payment Link Sent">
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Yes
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Payment Link" span={2}>
                        <a
                          href={selectedOrder.paymentDetails.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {selectedOrder.paymentDetails.paymentLink}
                        </a>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                  <Divider />
                </>
              )}

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <HomeOutlined /> Shipping Address
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-medium">
                    {selectedOrder.shippingAddress?.firstName}{" "}
                    {selectedOrder.shippingAddress?.lastName}
                  </p>
                  {selectedOrder.shippingAddress?.companyName && (
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress.companyName}
                    </p>
                  )}
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedOrder.shippingAddress?.address}
                    </p>
                    {selectedOrder.shippingAddress?.addressLine2 && (
                      <p>
                        <strong>Address Line 2:</strong>{" "}
                        {selectedOrder.shippingAddress.addressLine2}
                      </p>
                    )}
                    <p>
                      <strong>City:</strong>{" "}
                      {selectedOrder.shippingAddress?.city}
                    </p>
                    <p>
                      <strong>State:</strong>{" "}
                      {selectedOrder.shippingAddress?.state}
                    </p>
                    <p>
                      <strong>ZIP Code:</strong>{" "}
                      {selectedOrder.shippingAddress?.zipCode}
                    </p>
                    <p>
                      <strong>Country:</strong>{" "}
                      {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>
                  <Divider className="my-2" />
                  <div className="space-y-1 text-sm">
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
                  <Divider className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total:</span>
                    <span>${selectedOrder.totalPrice?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.isPaymentLinkSent &&
                    selectedOrder.paymentDetails && (
                      <>
                        <Divider className="my-2" />
                        <div className="flex justify-between text-blue-600 font-semibold">
                          <span>Payable Amount:</span>
                          <span>
                            $
                            {selectedOrder.paymentDetails.payableAmount?.toFixed(
                              2
                            )}
                          </span>
                        </div>
                      </>
                    )}
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
                    dataIndex: ["partsId", "mainImage"],
                    width: 80,
                    render: (mainImage, item) => (
                      <Image
                        src={
                          mainImage ||
                          (item.partsId?.images?.[0]
                            ? `${import.meta.env.VITE_BASE_URL}${
                                item.partsId.images[0]
                              }`
                            : "/placeholder.png")
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
                        {item.isAssemblyPrice && (
                          <Tag color="blue" className="mt-1 text-xs">
                            With Assembly
                          </Tag>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: "Unit Price",
                    render: (_, item) => {
                      const basePrice = item.partsId?.price?.wholesale || 0;
                      const assemblyPrice = item.isAssemblyPrice
                        ? item.partsId?.assemblyPrice || 0
                        : 0;
                      const totalUnitPrice = basePrice + assemblyPrice;

                      return (
                        <div className="text-right">
                          <div>${totalUnitPrice.toFixed(2)}</div>
                          {item.isAssemblyPrice && assemblyPrice > 0 && (
                            <div className="text-xs text-gray-500">
                              (Base: ${basePrice.toFixed(2)} + Assembly: $
                              {assemblyPrice.toFixed(2)})
                            </div>
                          )}
                        </div>
                      );
                    },
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
                    render: (_, item) => {
                      const itemTotal = calculateItemTotal(item);
                      return (
                        <span className="font-medium">
                          ${itemTotal.toFixed(2)}
                        </span>
                      );
                    },
                    align: "right",
                  },
                ]}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      colSpan={4}
                      className="font-bold text-right"
                    >
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
            {selectedOrder.createdBy && (
              <div className="text-sm text-gray-500 mt-4">
                <strong>Created By:</strong>{" "}
                {selectedOrder.createdBy?.firstName}{" "}
                {selectedOrder.createdBy?.lastName} (
                {selectedOrder.createdBy?.email})
              </div>
            )}

            {/* Updated By Info */}
            {selectedOrder.updatedBy && (
              <div className="text-sm text-gray-500">
                <strong>Last Updated By:</strong>{" "}
                {selectedOrder.updatedBy?.firstName}{" "}
                {selectedOrder.updatedBy?.lastName} (
                {selectedOrder.updatedBy?.email})
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Payment Link Modal */}
      <Modal
        title={
          <span className="text-xl font-bold flex items-center gap-2">
            <SendOutlined /> Send Payment Link
          </span>
        }
        open={isPaymentModalOpen}
        onCancel={() => {
          setIsPaymentModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSendPaymentLink}
        okText="Send Payment Link"
        cancelText="Cancel"
        confirmLoading={isSendingPayment}
        width={500}
        centered
      >
        <Form form={form} layout="vertical" className="py-4">
          <Form.Item name="orderId" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Order Number" name="orderNumber">
            <Input disabled className="bg-gray-50" />
          </Form.Item>

          <Form.Item
            label="Payable Amount ($)"
            name="payableAmount"
            rules={[
              { required: true, message: "Please enter payable amount" },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid amount",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter payable amount"
              prefix="$"
              step="0.01"
            />
          </Form.Item>

          <Form.Item
            label="Payment Link"
            name="paymentLink"
            rules={[
              { required: true, message: "Please enter payment link" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const regex = /^https:\/\/.+/;
                  if (regex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Payment link must start with https://")
                  );
                },
              },
            ]}
          >
            <Input.TextArea
              placeholder="Enter payment link URL (e.g., https://payment.example.com/...)"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Order;
