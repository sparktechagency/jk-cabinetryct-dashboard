import {
  BlockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllUsersByBranchQuery,
  useUpdateUserStatusMutation,
} from "../../../redux/features/users/usersApi";
import toast from "react-hot-toast";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data: usersResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersByBranchQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchTerm,
    status: statusFilter,
  });
  const [updateUserStatus] = useUpdateUserStatusMutation();

  // Handle search input change
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const navigate = useNavigate();

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus({
        id: userId,
        data: { status: newStatus },
      }).unwrap();

      toast.success(`User status updated to ${newStatus}`);
      refetch(); // Refetch the updated data
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Get the users data from the response
  const users =
    usersResponse?.data?.map((user) => ({
      key: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      companyName: user.companyName,
      companyWebsite: user.companyWebsite,
      status: user.status,
      profileImage: user.profileImage,
      businessType: user.businessType,
      createdAt: user.createdAt,
    })) || [];

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  // Status actions dropdown menu
  const getStatusMenu = (user) => ({
    items: [
      {
        key: "block",
        label: "Block",
        icon: <BlockOutlined />,
        disabled: user.status === "blocked",
        onClick: () => {
          Modal.confirm({
            title: "Block User",
            content: `Are you sure you want to block this user?`,
            onOk: () => handleUserStatusChange(user.key, "blocked"),
          });
        },
      },
      {
        key: "unblock",
        label: "Unblock",
        icon: <CheckCircleOutlined />,
        disabled: user.status !== "blocked",
        onClick: () => {
          Modal.confirm({
            title: "Unblock User",
            content: `Are you sure you want to unblock this user?`,
            onOk: () => handleUserStatusChange(user.key, "verified"),
          });
        },
      },
      {
        key: "delete",
        label: "Delete",
        icon: <CloseCircleOutlined />,
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: "Delete User",
            content: `Are you sure you want to delete this user? This action cannot be undone.`,
            onOk: () => handleUserStatusChange(user.key, "deleted"),
          });
        },
      },
    ],
  });

  const columns = [
    {
      title: "User Name",
      dataIndex: ["firstName", "lastName"],
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={`${record?.profileImage}`}
            alt=""
            className="size-14 rounded-full"
          />
          <div>
            <div className="font-medium text-gray-900">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Mobile Number",
      dataIndex: "phoneNumber",
      key: "phophoneNumberne",
    },
    {
      title: "Address",
      key: "address",
      render: (_, record) => (
        <div>
          <div className="text-gray-900">{record.address}</div>
          {record.addressLine2 && (
            <div className="text-sm text-gray-500">{record.addressLine2}</div>
          )}
        </div>
      ),
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Website",
      dataIndex: "companyWebsite",
      key: "companyWebsite",
    },
    {
      title: "Business Type",
      key: "businessType",
      render: (_, record) => <Tag color="blue" className="uppercase">{record.businessType}</Tag>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const statusConfig = {
          unverified: { color: "orange", text: "Unverified" },
          verified: { color: "green", text: "Verified" },
          blocked: { color: "red", text: "Blocked" },
          deleted: { color: "gray", text: "Deleted" },
        };
        const config = statusConfig[record.status] || {
          color: "default",
          text: record.status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record.key)}
          />
          <Dropdown menu={getStatusMenu(record)} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Pagination configuration
  const paginationConfig = usersResponse?.meta
    ? {
        current: usersResponse.meta.page,
        pageSize: usersResponse.meta.limit,
        total: usersResponse.meta.totalResult,
        totalPages: usersResponse.meta.totalPages,
        onChange: (page, size) => {
          setCurrentPage(page);
          if (size !== pageSize) {
            setPageSize(size);
            setCurrentPage(1); // Reset to first page when page size changes
          }
        },
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50"],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
        position: ["bottomCenter"],
      }
    : {
        pageSize: 10,
        showSizeChanger: true,
        position: ["bottomCenter"],
      };

  if (isError) {
    return (
      <div className="w-full p-6 bg-white border rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-primary">User list</h2>
        <div className="text-center py-10">
          <p className="text-red-500">Error loading users data</p>
          <Button onClick={() => refetch()} type="primary" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white border rounded-xl">
      <Row justify="space-between" align="middle" className="mb-6">
        <Col>
          <h2 className="text-2xl font-semibold text-primary">User list</h2>
        </Col>
        <Col>
          <Row gutter={16} align="middle">
            <Col>
              <Select
                placeholder="Filter by status"
                style={{ width: 150 }}
                allowClear
                onChange={handleStatusFilter}
                value={statusFilter}
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="unverified">Unverified</Select.Option>
                <Select.Option value="verified">Verified</Select.Option>
                <Select.Option value="blocked">Blocked</Select.Option>
              </Select>
            </Col>
            <Col>
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 200 }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        pagination={paginationConfig}
        rowKey="key"
      />
    </div>
  );
};

export default Users;
