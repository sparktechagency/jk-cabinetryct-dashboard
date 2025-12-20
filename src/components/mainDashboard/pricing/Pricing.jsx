import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space, Typography } from "antd";
import { useState } from "react";
import {
  useAddPricingMutation,
  useGetPricingQuery,
} from "../../../redux/features/pricing/pricingApi";
import toast from "react-hot-toast";
const { Text } = Typography;

const Pricing = () => {
  const { data: pricingData, isLoading, refetch } = useGetPricingQuery();
  const [addPricing] = useAddPricingMutation();
  const [shippingValue, setShippingValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Extract current shipping value, default to 0 if not found
  const currentShippingValue = pricingData?.data?.shipping ?? 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the pricing data using only addPricing mutation
      await addPricing({ shipping: parseFloat(shippingValue) }).unwrap();
      toast.success("Shipping cost updated successfully!");
      setShippingValue("");
      setIsEditing(false);
      refetch(); // Refresh data after mutation
    } catch (err) {
      console.error("Error saving pricing:", err);
      toast.error("Failed to update shipping cost. Please try again.");
    }
  };

  const startEditing = () => {
    setShippingValue(currentShippingValue.toString());
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setShippingValue("");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        Loading pricing data...
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto">
      <h1 className="text-2xl font-semibold text-primary">Pricing</h1>

      <div className="mt-6">
        <h1 className="text-lg">Current Shipping Cost</h1>
        <div className="mt-2">
          <h1
            type="success"
            className="font-semibold  text-primary text-xl md:text-3xl"
          >
            ${currentShippingValue.toFixed(2)}
          </h1>
        </div>
      </div>

      <div className="mt-8">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Space direction="vertical" size="small">
                <Text strong>New Shipping Cost</Text>
                <Input
                  type="number"
                  step="0.01"
                  value={shippingValue}
                  onChange={(e) => setShippingValue(e.target.value)}
                  placeholder="Enter shipping cost"
                  size="large"
                  style={{ width: "100%" }}
                  required
                />
              </Space>

              <Space size="small">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  size="middle"
                >
                  Save
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={cancelEditing}
                  size="middle"
                >
                  Cancel
                </Button>
              </Space>
            </Space>
          </form>
        ) : (
          <Space size="middle">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={startEditing}
              size="middle"
            >
              {currentShippingValue !== 0
                ? "Update Shipping"
                : "Set Shipping Cost"}
            </Button>
          </Space>
        )}
      </div>
    </Card>
  );
};

export default Pricing;
