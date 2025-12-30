import Barchart from "./Barchart";
import Card from "./Card";
import RecentOrders from "./RecentOrders";

const DashboardHome = () => {
  return (
    <div>
      <Card/>
      <Barchart />
      <RecentOrders />
    </div>
  );
};

export default DashboardHome;
