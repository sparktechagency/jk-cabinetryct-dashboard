import { DeleteOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateAdminSupportingAdminMutation,
  useDeleteAdminSupportingAdminMutation,
  useGetAdminSupportingAdminQuery,
} from "../../redux/features/adminSupportingAdmin/adminSupportingAdminApi";
import { useGetSingleBranchQuery } from "../../redux/features/branch/branchApi";
import toast from "react-hot-toast";

const { TabPane } = Tabs;
const { Option } = Select;

const BranchAdminSupportingAdmins = () => {
  const { branchId } = useParams();
  const [activeTab, setActiveTab] = useState("branch");
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [form] = Form.useForm();

  // Fetch branch data
  const { data: branchData, isLoading: branchLoading } =
    useGetSingleBranchQuery(branchId);

  // Fetch admins based on branchId and role with pagination parameters
  const {
    data: adminsData,
    isLoading,
    refetch,
  } = useGetAdminSupportingAdminQuery({
    branchId: branchId,
    ...pagination,
  });

  const [deleteAdmin, { isLoading: deletingAdmin }] =
    useDeleteAdminSupportingAdminMutation();
  const [createAdmin, { isLoading: creatingAdmin }] =
    useCreateAdminSupportingAdminMutation();

  // Filter admins based on role since API no longer filters by role in the endpoint
  const allAdmins = adminsData?.data || [];
  const filteredAdmins = allAdmins.filter(
    (admin) =>
      (activeTab === "branch" && (admin.role === "admin" || admin.role === "super_admin")) ||
      (activeTab === "supporting" && (admin.role === "supporting_admin" || admin.role === "user"))
  );

  const handleAddAdmin = async () => {
    try {
      const values = await form.validateFields();

      // Prepare the data to match the API requirements
      const adminData = {
        email: values.email,
        branchId: branchId,
        role: values.role,
        password: values.tempPass,
        // Additional fields could be added here as needed
      };

      await createAdmin(adminData).unwrap();
      toast.success(
        `${
          values.role === "branch" ? "Branch" : "Supporting"
        } Admin created successfully!`
      );

      setIsModalOpen(false);
      form.resetFields();
      refetch(); // Refresh the data after successful creation
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error(
        error?.data?.message || "Failed to create admin. Please try again."
      );
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    try {
      await deleteAdmin(adminToDelete._id).unwrap();
      toast.success("Admin deleted successfully!");
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      refetch(); // Refresh the data after successful deletion
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error(
        error?.data?.message || "Failed to delete admin. Please try again."
      );
    }
  };

  const openDeleteModal = (admin) => {
    setAdminToDelete(admin);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      title: "Admin name",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Space>
          <Avatar className="bg-red-600 text-white">
            {email?.split("@")[0]?.charAt(0).toUpperCase()}
          </Avatar>
          <span className="font-medium">
            {email?.split("@")[0]} {/* Use email username as name */}
          </span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="text-blue-600">{email}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "verified" ? "green" : "orange"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color="blue">
          {role === "admin"
            ? "Branch Admin"
            : role === "supporting_admin"
            ? "Supporting Admin"
            : role === "super_admin"
            ? "Super Admin"
            : "User"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete Admin"
            description="Are you sure you want to delete this admin?"
            onConfirm={() => openDeleteModal(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={deletingAdmin}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Update the active tab when role changes and reset pagination
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
    refetch();
  }, [activeTab, branchId, refetch]);

  return (
    <section className="w-full p-6 bg-white border rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          {branchLoading
            ? "Loading..."
            : branchData?.data?.name || "Branch Admins"}
        </h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="bg-primary border-none"
          loading={creatingAdmin}
        >
          Add Admin
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarGutter={40}
          className="branch-admin-tabs"
        >
          <TabPane
            tab={
              <span
                className={
                  activeTab === "branch" ? "text-primary font-semibold" : ""
                }
              >
                Branch Admin
              </span>
            }
            key="branch"
          />
          <TabPane
            tab={
              <span
                className={
                  activeTab === "supporting" ? "text-primary font-semibold" : ""
                }
              >
                Supporting Admin
              </span>
            }
            key="supporting"
          />
        </Tabs>

        <div className="border-b border-gray-200 -mx-6"></div>
      </div>

      {/* Table */}
      <div className="p-6">
        <Table
          columns={columns}
          dataSource={filteredAdmins}
          loading={isLoading}
          pagination={{
            current: adminsData?.meta?.page || pagination.page,
            pageSize: adminsData?.meta?.limit || pagination.limit,
            total: adminsData?.meta?.totalResult,
            position: ["bottomCenter"],
            showSizeChanger: false,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                page,
                limit: pageSize,
              }));
            },
          }}
          rowClassName="hover:bg-gray-50"
        />

        <div className="text-center text-sm text-gray-500 mt-4">
          {adminsData?.meta
            ? `Showing ${
                (adminsData.meta.page - 1) * adminsData.meta.limit + 1
              } - ${Math.min(
                adminsData.meta.page * adminsData.meta.limit,
                adminsData.meta.totalResult
              )} of ${adminsData.meta.totalResult} entries`
            : `Showing ${filteredAdmins.length} entries`}
        </div>
      </div>

      {/* Add Admin Modal with Role Selection */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-primary">
            <MailOutlined />
            <span className="font-bold">Add New Admin</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
        centered
      >
        <Form form={form} layout="vertical" className="mt-6">
          {/* Role Selection */}
          <Form.Item
            name="role"
            label="Select Role"
            rules={[{ required: true, message: "Please select a role" }]}
            initialValue="admin"
          >
            <Select size="large" placeholder="Choose admin role">
              <Option value="admin">Branch Admin</Option>
              <Option value="supporting_admin">Supporting Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Admin email"
            rules={[
              { required: true, message: "Please enter admin email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Type admin email" size="large" />
          </Form.Item>

          <Form.Item
            name="tempPass"
            label="Temporary Password"
            rules={[
              { required: true, message: "Please set a temporary password" },
            ]}
          >
            <Input.Password
              placeholder="Type a temporary password"
              size="large"
            />
          </Form.Item>

          <Form.Item name="message" label="An Invitation Message">
            <Input.TextArea
              rows={4}
              placeholder="Type your toast..."
              defaultValue="Welcome! You have been added as an admin. Please log in using the temporary password and change it immediately."
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button size="large" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleAddAdmin}
              className="bg-primary"
              loading={creatingAdmin}
            >
              Create Admin
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDeleteAdmin}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setAdminToDelete(null);
        }}
        okText="Yes, Delete"
        cancelText="Cancel"
        confirmLoading={deletingAdmin}
      >
        <p>Are you sure you want to delete this admin?</p>
        {adminToDelete && (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Email">
              {adminToDelete.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              {adminToDelete.role === "admin" ? "Branch Admin" :
               adminToDelete.role === "supporting_admin" ? "Supporting Admin" :
               adminToDelete.role === "super_admin" ? "Super Admin" : "User"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </section>
  );
};

export default BranchAdminSupportingAdmins;
