import { NavLink, Outlet } from "react-router-dom";
import "../adminstyle/AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>

        {/* ✅ Sidebar Navigation */}
        <nav>
          <ul>
            <li><NavLink to="/admin">Orders</NavLink></li>
            <li><NavLink to="/admin/products">Products</NavLink></li>
            <li><NavLink to="/admin/users">Users</NavLink></li>
            <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main className="main-content">
        {/* ✅ Yaha child routes render honge */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;



