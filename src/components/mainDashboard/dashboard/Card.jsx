import {
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { useGetDashboardAnalyticsQuery } from "../../../redux/features/analytics/analyticsApi";
import { GrOrderedList } from "react-icons/gr";

const Card = () => {
  const { data } = useGetDashboardAnalyticsQuery();
  const responseData = data?.data;
  console.log("responseData", responseData);
  const cardData = [
    {
      title: "Total Revenue",
      value: `${responseData?.totalRevenue}` || "$0",
      icon: <DollarOutlined className="w-8 h-8" />,
      bgColor: "from-green-500 to-green-600",
    },
    {
      title: "Total Orders",
      value: `${responseData?.totalOrders}` || "0",
      icon: <ShoppingOutlined className="w-8 h-8" />,
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Customers",
      value: `${responseData?.totalCustomers}` || "0",
      icon: <UserOutlined className="w-8 h-8" />,
      bgColor: "from-purple-500 to-purple-600",
    },
    {
      title: "Pending Orders",
      value: `${responseData?.pendingOrders}` || "0",
      icon: <FileDoneOutlined className="w-8 h-8" />,
      bgColor: "from-orange-500 to-orange-600",
    },
    {
      title: "Completed Orders",
      value: `${responseData?.completedOrders}` || "0",
      icon: <GrOrderedList className="size-6" />,
      bgColor: "from-[#721011] to-[#8B1315]",
    },
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl text-[#721011]">Overview</h1>
      </div>
      <div className="grid md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            {/* Gradient Background for Icon */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgColor} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300`}
            ></div>

            <div className="p-6 relative z-10">
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-lg bg-gradient-to-br ${card.bgColor} flex justify-center items-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {card.icon}
              </div>

              {/* Title */}
              <p className="text-sm font-medium text-gray-600 mb-2">
                {card.title}
              </p>

              {/* Value and Trend */}
              <div className="flex justify-between items-end">
                <h1 className="text-3xl font-bold text-gray-800">
                  {card.value}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
