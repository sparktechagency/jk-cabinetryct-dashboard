import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAddBranchMutation,
  useDeleteBranchMutation,
  useGetBranchesQuery,
  useUpdateBranchMutation,
} from "../../redux/features/branch/branchApi";
import toast from "react-hot-toast";

const Branch = () => {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const {
    data: branchesData,
    isLoading,
    refetch,
  } = useGetBranchesQuery({
    ...pagination,
  });
  const branches = branchesData?.data || [];

  const [addBranch, { isLoading: isAdding }] = useAddBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingBranch, setDeletingBranch] = useState(null);
  const [form] = Form.useForm();

  // Open Modal for Create / Edit
  const openModal = (branch = null) => {
    setEditingBranch(branch);
    if (branch) {
      form.setFieldsValue({
        name: branch.name,
        address: branch.address,
        contactNumber: branch.contactNumber,
        email: branch.email,
        tax: branch.tax,
        fbLink: branch.fbLink,
        instaLink: branch.instaLink,
        homePageVideoLink: branch.homePageVideoLink,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingBranch) {
        // Update existing branch
        await updateBranch({ id: editingBranch._id, data: values }).unwrap();
        toast.success("Branch updated successfully!");
      } else {
        // Create new branch
        await addBranch(values).unwrap();
        toast.success("Branch created successfully!");
      }

      setIsModalOpen(false);
      setEditingBranch(null);
      form.resetFields();
      refetch(); // Refresh data after successful operation
    } catch (error) {
      console.error("Error saving branch:", error);
      toast.error(
        error?.data?.message || "Failed to save branch. Please try again."
      );
    }
  };

  // Delete Confirmation
  const confirmDelete = (branch) => {
    setDeletingBranch(branch);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBranch(deletingBranch._id).unwrap();
      toast.success("Branch deleted successfully!");
      setIsDeleteConfirmOpen(false);
      setDeletingBranch(null);
      refetch(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast.error(
        error?.data?.message || "Failed to delete branch. Please try again."
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: 80,
      render: (id) => <span>{id?.substring(0, 6)}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => <span>{record.contactNumber || "-"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (tax) => (tax !== undefined ? `${tax}%` : "-"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/super-admin/branch-admins/${record?._id}`}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            disabled={isUpdating}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Branch?"
            description="Are you sure you want to delete this branch?"
            onConfirm={() => confirmDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full p-6 bg-white border rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Branch List</h2>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          loading={isAdding}
        >
          Create Branch
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={branches}
        loading={isLoading}
        pagination={{
          current: branchesData?.meta?.page || pagination.page,
          pageSize: branchesData?.meta?.limit || pagination.limit,
          total: branchesData?.meta?.totalResult,
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
        {branchesData?.meta
          ? `Showing ${
              (branchesData.meta.page - 1) * branchesData.meta.limit + 1
            } - ${Math.min(
              branchesData.meta.page * branchesData.meta.limit,
              branchesData.meta.totalResult
            )} of ${branchesData.meta.totalResult} entries`
          : `Showing ${branches.length} entries`}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-primary">
            {editingBranch ? "Edit Branch" : "Create New Branch"}
          </span>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBranch(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
        centered
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="name"
            label="Branch name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Type branch name" size="large" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} placeholder="Type your branch address" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="contactNumber"
              label="Contact Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="+880000" size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="example@gmail.com" size="large" />
            </Form.Item>
          </div>

          <Form.Item name="tax" label="Tax (%)">
            <InputNumber
              type="number"
              min={0}
              max={100}
              className="w-full"
              placeholder="6%"
            />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fb Link */}
            <Form.Item name="fbLink" label="Facebook Link">
              <Input placeholder="https://" size="large" />
            </Form.Item>
            {/* Instagram Link */}
            <Form.Item name="instaLink" label="Instagram Link">
              <Input placeholder="https://" size="large" />
            </Form.Item>
            {/* Homepage Video Link */}
            <Form.Item name="homePageVideoLink" label="Homepage Video Link">
              <Input placeholder="https://" size="large" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              size="large"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBranch(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSave}
              loading={editingBranch ? isUpdating : isAdding}
              className="px-8"
            >
              {editingBranch ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Think Again! Delete Confirmation Modal */}
      <Modal
        open={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        footer={null}
        centered
        width={420}
        closable={false}
        className="text-center"
      >
        <div className="py-8">
          <div className="text-6xl mb-4">
            <DeleteOutlined className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-orange-600 mb-4">
            Think Again !!
          </h3>
          <p className="text-lg font-medium text-gray-800 mb-6">
            You want to Delete this Branch?
          </p>

          <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg mb-6">
            <p className="flex items-center gap-2 text-sm">
              <ExclamationCircleOutlined className="text-orange-500" />
              All Admin will removed
            </p>
            <p className="flex items-center gap-2 text-sm">
              <ExclamationCircleOutlined className="text-orange-500" />
              All user will remove
            </p>
            <p className="flex items-center gap-2 text-sm">
              <ExclamationCircleOutlined className="text-orange-500" />
              All Product will removed
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button size="large" loading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Branch;
