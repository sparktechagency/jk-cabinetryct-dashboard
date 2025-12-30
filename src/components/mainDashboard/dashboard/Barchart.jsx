/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Select } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { useGetOrderStaticsQuery } from "../../../redux/features/analytics/analyticsApi";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border-2 border-[#721011] rounded-lg shadow-lg">
        <p className="font-bold text-[#721011] mb-2">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <p className="text-sm text-gray-700">
              {item.dataKey === "revenue" ? "Revenue" : "Orders"}:{" "}
              <span className="font-semibold">
                {item.dataKey === "revenue"
                  ? `$${item.value.toLocaleString()}`
                  : item.value}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Barchart = () => {
  const currentYear = new Date().getFullYear(); // e.g., 2025
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const handleChange = (value) => {
    setSelectedYear(value);
  };

  // Generate year options: current year - 6 to current year + 6
  const yearOptions = [];
  for (let i = -6; i <= 6; i++) {
    const year = currentYear + i;
    yearOptions.push({
      value: year.toString(),
      label: year.toString(),
    });
  }

  // Fetch data based on selected year
  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
  } = useGetOrderStaticsQuery({
    period: "yearly",
    year: parseInt(selectedYear),
  });

  // Refetch when year changes
  useEffect(() => {
    refetch();
  }, [selectedYear, refetch]);

  // Transform API response to chart format
  const chartData =
    orderData?.data?.map((item) => ({
      month: item.period, // assuming period is like "January", "Feb", etc.
      revenue: item.revenue,
      orders: item.count,
    })) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#721011] to-[#8B1315] flex items-center justify-center shadow-md">
              <DollarOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#721011]">
                Order and Revenue Statistics
              </h1>
              <p className="text-sm text-gray-500">
                Monthly revenue and orders tracking
              </p>
            </div>
          </div>
          <Select
            value={selectedYear}
            className="w-32"
            size="large"
            onChange={handleChange}
            options={yearOptions}
          />
        </div>
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#721011] to-[#8B1315] flex items-center justify-center shadow-md">
              <DollarOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#721011]">
                Order and Revenue Statistics
              </h1>
              <p className="text-sm text-gray-500">
                Monthly revenue and orders tracking
              </p>
            </div>
          </div>
          <Select
            value={selectedYear}
            className="w-32"
            size="large"
            onChange={handleChange}
            options={yearOptions}
          />
        </div>
        <div className="flex justify-center items-center h-80">
          <p className="text-red-500">
            Error loading chart data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#721011] to-[#8B1315] flex items-center justify-center shadow-md">
            <DollarOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-[#721011]">
              Order and Revenue Statistics
            </h1>
            <p className="text-sm text-gray-500">
              Monthly revenue and orders tracking
            </p>
          </div>
        </div>

        <Select
          value={selectedYear}
          className="w-32"
          size="large"
          onChange={handleChange}
          options={yearOptions}
        />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#721011" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#721011" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(114, 16, 17, 0.05)" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
            formatter={(value) => (value === "revenue" ? "Revenue" : "Orders")}
          />
          <Bar
            dataKey="revenue"
            fill="url(#colorRevenue)"
            barSize={35}
            radius={[8, 8, 0, 0]}
            name="Revenue"
          />
          <Bar
            dataKey="orders"
            fill="url(#colorOrders)"
            barSize={35}
            radius={[8, 8, 0, 0]}
            name="Orders"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Barchart;
