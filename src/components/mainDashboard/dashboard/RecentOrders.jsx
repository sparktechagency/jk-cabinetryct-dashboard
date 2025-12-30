import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Modal, Table, Tag } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetRecentOrdersQuery } from "../../../redux/features/analytics/analyticsApi";

const RecentOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch recent orders data from API
  const { data: recentOrdersData, isLoading, isError } = useGetRecentOrdersQuery();

  // Transform API data to match table format
  const transactions = recentOrdersData?.data?.map((order, index) => ({
    key: order?._id,
    transactionId: order?.orderNumber,
    customerName: `${order?.userId.firstName} ${order?.userId.lastName}`,
    customerAvatar: order?.userId?.firstName?.charAt(0),
    email: order?.userId.email,
    phone: "", // Phone is not in the API response
    amount: order?.totalPrice,
    paymentMethod: "N/A", // Payment method is not in the API response
    status: order?.status,
    date: new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    ...order
  })) || [];

  const getStatusConfig = (status) => {
    const config = {
      confirmed: {
        text: "Confirmed",
        color: "green",
        icon: <CheckCircleOutlined />,
      },
      pending: {
        text: "Pending",
        color: "orange",
        icon: <ClockCircleOutlined />,
      },
      cancelled: { text: "Cancelled", color: "red", icon: <CloseCircleOutlined /> },
    };
    return config[status] || { text: status.charAt(0).toUpperCase() + status.slice(1), color: "default" };
  };

  const columns = [
    {
      title: "Order Number",
      dataIndex: "transactionId",
      render: (text) => (
        <span className="font-semibold text-[#721011]">{text}</span>
      ),
    },
    {
      title: "Customer",
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Avatar style={{ backgroundColor: "#721011" }}>
            {r.customerAvatar}
          </Avatar>
          <span className="font-medium">{r.customerName}</span>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => (
        <span className="text-base font-bold text-[#721011]">
          ${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        />
      ),
    },
  ];

  const handleView = (record) => {
    setSelectedTransaction(record);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-bold text-xl text-[#721011]">Recent Orders</h1>
            <p className="text-gray-600 text-sm">Manage your recent orders</p>
          </div>
          <Link to="/order">
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              style={{ backgroundColor: "#721011" }}
            >
              View All
            </Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading recent orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-bold text-xl text-[#721011]">Recent Orders</h1>
            <p className="text-gray-600 text-sm">Manage your recent orders</p>
          </div>
          <Link to="/order">
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              style={{ backgroundColor: "#721011" }}
            >
              View All
            </Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading recent orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-bold text-xl text-[#721011]">Recent Orders</h1>
          <p className="text-gray-600 text-sm">Manage your recent orders</p>
        </div>
        <Link to="/order">
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            style={{ backgroundColor: "#721011" }}
          >
            View All
          </Button>
        </Link>
      </div>
      <Table
        dataSource={transactions}
        columns={columns}
        pagination={false}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
      />

      {/* Order Details Modal */}
      <Modal
        title={
          <span className="text-lg font-bold text-[#721011]">
            Order Details
          </span>
        }
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={600}
      >
        {selectedTransaction && (
          <div className="space-y-4">
            {/* Order Number and Status */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-bold text-[#721011]">
                  {selectedTransaction.transactionId}
                </p>
              </div>
              <Tag
                icon={getStatusConfig(selectedTransaction.status).icon}
                color={getStatusConfig(selectedTransaction.status).color}
                className="text-base px-3 py-1"
              >
                {getStatusConfig(selectedTransaction.status).text}
              </Tag>
            </div>

            <Divider />

            {/* Customer Info */}
            <div>
              <h3 className="font-semibold text-base mb-3">
                Customer Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar size={48} style={{ backgroundColor: "#721011" }}>
                    {selectedTransaction.customerAvatar}
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {selectedTransaction.customerName}
                    </p>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MailOutlined className="text-[#721011]" />
                  {selectedTransaction.email}
                </div>
                {selectedTransaction.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <PhoneOutlined className="text-[#721011]" />
                    {selectedTransaction.phone}
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{selectedTransaction.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="font-semibold">${selectedTransaction.amount.toFixed(2)}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-gradient-to-r from-[#721011] to-[#8B1315] text-white p-4 rounded-lg">
              <p className="text-sm opacity-90">Total Amount</p>
              <p className="text-3xl font-bold">
                ${selectedTransaction.amount.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecentOrders;
