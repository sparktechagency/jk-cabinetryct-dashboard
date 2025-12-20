import Card from "./Card";
import Barchart from "./Barchart";
import Transaction from "./Transaction";

const DashboardHome = () => {
  return (
    <div>
      <Card/>
      <Barchart />
      <Transaction />
    </div>
  );
};

export default DashboardHome;
