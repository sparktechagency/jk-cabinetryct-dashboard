import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Popconfirm, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
  useDeleteCollectionMutation,
  useGetAllCollectionsQuery,
} from "../../../redux/features/collection/collectionApi";
import toast from "react-hot-toast";

const CollectionList = () => {
  const navigate = useNavigate();
  const { data: collectionData, isLoading, error } = useGetAllCollectionsQuery();
  const [deleteCollection] = useDeleteCollectionMutation();

  const handleDeleteCollection = async (collectionId, e) => {
    e.stopPropagation();
    try {
      const res = await deleteCollection(collectionId).unwrap();
      toast.success(res?.message || "Collection deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete collection");
    }
  };

  const handleAddCollection = () => {
    navigate("/collection/add-collection");
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white border rounded-xl flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white border rounded-xl">
        <div className="text-center text-red-500 py-8">
          Error loading collection data. Please try again.
        </div>
      </div>
    );
  }

  const collections = collectionData?.data || [];

  return (
    <div className="w-full p-6 bg-white border rounded-xl">
      <div className="w-full flex flex-col md:flex-row gap-6 justify-between items-center mb-6">
        <div className="flex items-start gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/users")}
            className="text-gray-600 hover:text-primary"
          />
          <h2 className="text-2xl font-semibold text-primary">Collection list</h2>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAddCollection}
          className="flex items-center gap-2"
        >
          Add New Collection
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No collections found. Please add a collection to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {collections.map((collection) => (
            <Card
              key={collection._id}
              cover={
                <div className="relative rounded-t">
                  {collection.mainImage ? (
                    <img
                      src={`${collection.mainImage}`}
                      alt={collection.code}
                      className="w-full h-56 object-cover rounded-t"
                    />
                  ) : collection.images && collection.images.length > 0 ? (
                    <img
                      src={`${collection.images[0]}`}
                      alt={collection.code}
                      className="w-full h-56 object-cover rounded-t"
                    />
                  ) : (
                    <div className="bg-gray-300 h-32 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400"></div>
                    </div>
                  )}
                  {/* Action Buttons on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() =>
                        navigate(`/collection/edit-collection/${collection._id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Delete Collection"
                      description="Are you sure you want to delete this collection?"
                      onConfirm={(e) =>
                        handleDeleteCollection(collection._id, e)
                      }
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
              }
              className="text-center hover:shadow-lg transition-shadow relative group"
              bodyStyle={{ padding: "12px" }}
            >
              <div className="text-sm font-medium">{collection.code}</div>
              <div className="text-xs text-gray-600">{collection.color}</div>
            </Card>
          ))}

          <Card
            className="border-2 border-dashed border-gray-300 cursor-pointer hover:border-red-500 transition-colors"
            bodyStyle={{ padding: 0, height: "100%" }}
            onClick={handleAddCollection}
          >
            <div className="h-full flex items-center justify-center min-h-[180px]">
              <PlusOutlined className="text-3xl text-gray-400" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CollectionList;