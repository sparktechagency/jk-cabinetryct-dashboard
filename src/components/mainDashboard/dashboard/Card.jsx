import {
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
  RiseOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { TrendingUp, TrendingDown } from "lucide-react";

const Card = () => {
  const cardData = [
    {
      title: "Total Revenue",
      value: "$45,850",
      icon: <DollarOutlined className="w-8 h-8" />,
      bgColor: "from-green-500 to-green-600",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: "1,248",
      icon: <ShoppingOutlined className="w-8 h-8" />,
      bgColor: "from-blue-500 to-blue-600",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Total Customers",
      value: "856",
      icon: <UserOutlined className="w-8 h-8" />,
      bgColor: "from-purple-500 to-purple-600",
      trend: "+23.1%",
      trendUp: true,
    },
    {
      title: "Pending Orders",
      value: "124",
      icon: <FileDoneOutlined className="w-8 h-8" />,
      bgColor: "from-orange-500 to-orange-600",
      trend: "-5.4%",
      trendUp: false,
    },
    {
      title: "Growth Rate",
      value: "18.5%",
      icon: <RiseOutlined className="w-8 h-8" />,
      bgColor: "from-[#721011] to-[#8B1315]",
      trend: "+2.3%",
      trendUp: true,
    },
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl text-[#721011]">Overview</h1>
        <p className="text-sm text-gray-500">Last 30 days</p>
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
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    card.trendUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {card.trendUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {card.trend}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
