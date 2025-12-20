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
} from "antd";
import {
  EyeOutlined,
  MoreOutlined,
  DollarOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const TransactionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const transactions = [
    {
      key: "1",
      transactionId: "#TXN001234",
      date: "Jan 21, 2025",
      customerName: "Md Mahmudur Rahman Talukdar",
      customerEmail: "mahmud.uiuxdesigns@gmail.com",
      customerPhone: "+880 1770-504877",
      customerAvatar: "M",
      amount: 2500.0,
      paymentMethod: "Credit Card",
      paymentType: "online",
      status: "completed",
      description: "Order payment for cabinets",
      items: [
        { name: "Base Cabinet B09", price: 1200.5 },
        { name: "Wall Cabinet W24", price: 1299.5 },
      ],
    },
    {
      key: "2",
      transactionId: "#TXN001235",
      date: "Jan 20, 2025",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "+1 234 567 8900",
      customerAvatar: "J",
      amount: 1800.0,
      paymentMethod: "Bank Transfer",
      paymentType: "bank",
      status: "pending",
      description: "Payment for custom furniture",
      items: [{ name: "Custom Drawer Set", price: 1800.0 }],
    },
    {
      key: "3",
      transactionId: "#TXN001236",
      date: "Jan 19, 2025",
      customerName: "Sarah Williams",
      customerEmail: "sarah.w@example.com",
      customerPhone: "+1 555 123 4567",
      customerAvatar: "S",
      amount: 950.0,
      paymentMethod: "Cash",
      paymentType: "cash",
      status: "completed",
      description: "In-store purchase",
      items: [{ name: "Wall Cabinet Set", price: 950.0 }],
    },
    {
      key: "4",
      transactionId: "#TXN001237",
      date: "Jan 18, 2025",
      customerName: "Michael Brown",
      customerEmail: "m.brown@example.com",
      customerPhone: "+1 444 789 0123",
      customerAvatar: "M",
      amount: 3200.0,
      paymentMethod: "Credit Card",
      paymentType: "online",
      status: "failed",
      description: "Payment failed - retry required",
      items: [
        { name: "Kitchen Cabinet Set", price: 2500.0 },
        { name: "Installation Service", price: 700.0 },
      ],
    },
  ];

  const handleViewTransaction = (record) => {
    setSelectedTransaction(record);
    setIsModalOpen(true);
  };

  const getStatusConfig = (status) => {
    const config = {
      completed: { text: "Completed", color: "green", icon: <CheckCircleOutlined /> },
      pending: { text: "Pending", color: "orange", icon: <ClockCircleOutlined /> },
      failed: { text: "Failed", color: "red", icon: <CloseCircleOutlined /> },
    };
    return config[status] || { text: "Unknown", color: "default" };
  };

  const getPaymentTypeTag = (type) => {
    const types = {
      online: { text: "Online", color: "blue" },
      bank: { text: "Bank Transfer", color: "cyan" },
      cash: { text: "Cash", color: "green" },
    };
    return types[type] || { text: type, color: "default" };
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      render: (text) => (
        <span className="font-semibold text-[#721011]">{text}</span>
      ),
    },
    { title: "Date", dataIndex: "date" },
    {
      title: "Customer",
      render: (_, r) => (
        <div className="flex items-center gap-3">
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
        <span className="text-lg font-bold text-[#721011]">
          ${amount.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      render: (method, record) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{method}</span>
          <Tag color={getPaymentTypeTag(record.paymentType).color} className="w-fit">
            {getPaymentTypeTag(record.paymentType).text}
          </Tag>
        </div>
      ),
    },
    {
      title: "Status",
      render: (_, r) => {
        const config = getStatusConfig(r.status);
        return (
          <Select
            defaultValue={r.status}
            style={{ width: 140 }}
            suffixIcon={config.icon}
            options={[
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
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
            onClick={() => handleViewTransaction(record)}
          />
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="w-full p-6 bg-white border rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#721011]">
              Transaction History
            </h2>
            <p className="text-gray-600 mt-1">
              View and manage all payment transactions
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#721011] to-[#8B1315] text-white px-6 py-3 rounded-lg">
            <DollarOutlined className="text-2xl" />
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-2xl font-bold">
                $
                {transactions
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={transactions}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
          rowClassName="hover:bg-gray-50"
        />
      </div>

      {/* View Transaction Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-[#721011]">
            Transaction Details - {selectedTransaction?.transactionId}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        centered
      >
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div>
                <Badge
                  status="processing"
                  text={
                    <span className="font-medium">
                      Date: {selectedTransaction.date}
                    </span>
                  }
                />
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span>
                    <strong>Payment:</strong>{" "}
                    {selectedTransaction.paymentMethod}
                  </span>
                  <Tag
                    color={
                      getPaymentTypeTag(selectedTransaction.paymentType).color
                    }
                  >
                    {getPaymentTypeTag(selectedTransaction.paymentType).text}
                  </Tag>
                </div>
              </div>
              <Tag
                color={getStatusConfig(selectedTransaction.status).color}
                className="text-lg px-4 py-1"
                icon={getStatusConfig(selectedTransaction.status).icon}
              >
                {getStatusConfig(selectedTransaction.status).text}
              </Tag>
            </div>

            <Divider />

            {/* Customer & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Avatar
                    style={{ backgroundColor: "#721011" }}
                    icon={<MailOutlined />}
                  />
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p className="font-medium text-lg">
                    {selectedTransaction.customerName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MailOutlined />
                    {selectedTransaction.customerEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneOutlined />
                    {selectedTransaction.customerPhone}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CreditCardOutlined /> Payment Summary
                </h3>
                <div className="bg-gradient-to-br from-[#721011] to-[#8B1315] text-white p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Method:</span>
                    <span className="font-medium">
                      {selectedTransaction.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Type:</span>
                    <Tag color="white">
                      <span className="text-[#721011] font-medium">
                        {getPaymentTypeTag(selectedTransaction.paymentType).text}
                      </span>
                    </Tag>
                  </div>
                  <Divider style={{ borderColor: "rgba(255,255,255,0.3)" }} />
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total:</span>
                    <span>${selectedTransaction.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Transaction Items */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Transaction Items</h3>
              <Table
                dataSource={selectedTransaction.items}
                pagination={false}
                columns={[
                  { title: "Item Name", dataIndex: "name" },
                  {
                    title: "Price",
                    dataIndex: "price",
                    render: (p) => (
                      <span className="font-semibold">${p.toFixed(2)}</span>
                    ),
                    align: "right",
                  },
                ]}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell className="font-bold text-right">
                      Total Amount
                    </Table.Summary.Cell>
                    <Table.Summary.Cell className="font-bold text-right text-[#721011] text-lg">
                      ${selectedTransaction.amount.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </div>

            {/* Description */}
            {selectedTransaction.description && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> {selectedTransaction.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default TransactionPage;
