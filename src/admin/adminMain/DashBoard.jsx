// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell
// } from "recharts";
// import "../adminstyle/DashBoard.css";

// export default function Dashboard() {
//   const [stats, setStats] = useState({});
//   const [revenueData, setRevenueData] = useState([]);
//   const [topProducts, setTopProducts] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:8000/api/admin/analytics/stats")
//       .then(res => setStats(res.data));
//     axios.get("http://localhost:8000/api/admin/analytics/revenue-by-month")
//       .then(res => setRevenueData(res.data));
//     axios.get("http://localhost:8000/api/admin/analytics/top-products")
//       .then(res => setTopProducts(res.data));
//   }, []);

//   const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

//   return (
//     <div className="dashboard">
//       {/* Overview Card */}
//       <div className="card">
//         <h2 className="card-title">Overview</h2>
//         <p><strong>Total Orders:</strong> {stats.totalOrders || 0}</p>
//         <p><strong>Total Revenue:</strong> ₹{stats.totalRevenue || 0}</p>
//       </div>

//       {/* Revenue Chart */}
//       <div className="card">
//         <h2 className="card-title">Revenue by Month</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={revenueData}>
//             <XAxis dataKey="_id" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="revenue" fill="#8884d8" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Top Products Pie Chart */}
//       <div className="card full-width">
//         <h2 className="card-title">Top Products</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={topProducts}
//               dataKey="totalSold"
//               nameKey="title"
//               cx="50%"
//               cy="50%"
//               outerRadius={120}
//               label
//             >
//               {topProducts.map((_, index) => (
//                 <Cell key={index} fill={colors[index % colors.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "../adminstyle/DashBoard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [growthStats, setGrowthStats] = useState({});
  const [orderStatusData, setOrderStatusData] = useState([]);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  useEffect(() => {
    axios.get("http://localhost:8000/api/admin/analytics/stats").then(res => setStats(res.data));
    axios.get("http://localhost:8000/api/admin/analytics/revenue-by-month").then(res => setRevenueData(res.data));
    axios.get("http://localhost:8000/api/admin/analytics/top-products").then(res => setTopProducts(res.data));
    axios.get("http://localhost:8000/api/admin/analytics/growth").then(res => setGrowthStats(res.data));
    axios.get("http://localhost:8000/api/admin/analytics/order-status").then(res => setOrderStatusData(res.data));
  }, []);

  return (
    <div className="dashboard">

      {/* Overview Section */}
      <div className="overview-cards">
        <div className="card small-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders || 0}</p>
        </div>
        <div className="card small-card">
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue || 0}</p>
        </div>
        <div className="card small-card">
          <h3>New Users</h3>
          <p>{stats.newUsers || 0}</p>
        </div>
        <div className="card small-card">
          <h3>Revenue Growth</h3>
          <p className={growthStats.revenueGrowth > 0 ? "positive" : "negative"}>
            {growthStats.revenueGrowth ? growthStats.revenueGrowth + "%" : "0%"}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <h2 className="card-title">Revenue by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status Pie Chart */}
      <div className="card">
        <h2 className="card-title">Orders by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {orderStatusData.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="card full-width">
        <h2 className="card-title">Top Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topProducts}
              dataKey="totalSold"
              nameKey="title"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {topProducts.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
