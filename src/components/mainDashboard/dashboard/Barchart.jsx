/* eslint-disable react/prop-types */
import { useState } from "react";
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

const data = [
  { month: "Jan", revenue: 2400, orders: 1800 },
  { month: "Feb", revenue: 1398, orders: 2210 },
  { month: "Mar", revenue: 9800, orders: 2290 },
  { month: "Apr", revenue: 3908, orders: 2000 },
  { month: "May", revenue: 4800, orders: 2181 },
  { month: "Jun", revenue: 3800, orders: 2500 },
  { month: "Jul", revenue: 5300, orders: 2100 },
  { month: "Aug", revenue: 8300, orders: 3100 },
  { month: "Sep", revenue: 7300, orders: 2800 },
  { month: "Oct", revenue: 4300, orders: 2100 },
  { month: "Nov", revenue: 9300, orders: 3500 },
  { month: "Dec", revenue: 7300, orders: 2900 },
];

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
              {item.name}: <span className="font-semibold">${item.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Barchart = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleChange = (value) => {
    setSelectedYear(value);
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = (totalRevenue / data.length).toFixed(0);

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
              Revenue Overview
            </h1>
            <p className="text-sm text-gray-500">
              Monthly revenue and orders tracking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Avg. Monthly Revenue</p>
            <p className="text-lg font-bold text-[#721011]">${avgRevenue}</p>
          </div>
          <Select
            value={selectedYear}
            className="w-32"
            size="large"
            onChange={handleChange}
            options={[
              { value: "2024", label: "2024" },
              { value: "2023", label: "2023" },
              { value: "2022", label: "2022" },
            ]}
          />
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
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
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
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
