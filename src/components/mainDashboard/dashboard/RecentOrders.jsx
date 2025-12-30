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

const RecentOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const transactions = [
    {
      key: "1",
      transactionId: "#TXN001234",
      customerName: "Md Mahmudur Rahman",
      customerAvatar: "M",
      email: "mahmud@gmail.com",
      phone: "+880 1770-504877",
      amount: 2500.0,
      paymentMethod: "Credit Card",
      status: "completed",
      date: "Jan 21, 2025",
    },
    {
      key: "2",
      transactionId: "#TXN001235",
      customerName: "John Doe",
      customerAvatar: "J",
      email: "john.doe@example.com",
      phone: "+1 234 567 8900",
      amount: 1800.0,
      paymentMethod: "Bank Transfer",
      status: "pending",
      date: "Jan 20, 2025",
    },
    {
      key: "3",
      transactionId: "#TXN001236",
      customerName: "Sarah Williams",
      customerAvatar: "S",
      email: "sarah.w@example.com",
      phone: "+1 555 123 4567",
      amount: 950.0,
      paymentMethod: "Cash",
      status: "completed",
      date: "Jan 19, 2025",
    },
    {
      key: "4",
      transactionId: "#TXN001237",
      customerName: "Michael Brown",
      customerAvatar: "M",
      email: "m.brown@example.com",
      phone: "+1 444 789 0123",
      amount: 3200.0,
      paymentMethod: "Credit Card",
      status: "failed",
      date: "Jan 18, 2025",
    },
    {
      key: "5",
      transactionId: "#TXN001238",
      customerName: "Emily Davis",
      customerAvatar: "E",
      email: "emily.d@example.com",
      phone: "+1 333 456 7890",
      amount: 1450.0,
      paymentMethod: "PayPal",
      status: "completed",
      date: "Jan 17, 2025",
    },
  ];

  const getStatusConfig = (status) => {
    const config = {
      completed: {
        text: "Completed",
        color: "green",
        icon: <CheckCircleOutlined />,
      },
      pending: {
        text: "Pending",
        color: "orange",
        icon: <ClockCircleOutlined />,
      },
      failed: { text: "Failed", color: "red", icon: <CloseCircleOutlined /> },
    };
    return config[status] || { text: "Unknown", color: "default" };
  };

  const columns = [
    {
      title: "Transaction ID",
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

      {/* Transaction Details Modal */}
      <Modal
        title={
          <span className="text-lg font-bold text-[#721011]">
            Transaction Details
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
            {/* Transaction ID and Status */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
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
                <div className="flex items-center gap-2 text-sm">
                  <PhoneOutlined className="text-[#721011]" />
                  {selectedTransaction.phone}
                </div>
              </div>
            </div>

            <Divider />

            {/* Payment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold">
                  {selectedTransaction.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{selectedTransaction.date}</p>
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
