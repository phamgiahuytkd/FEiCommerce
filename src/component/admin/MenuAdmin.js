import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomeAdmin from './HomeAdmin';
import ProductAdmin from './ProductAdmin';
import Login from '../../authenticate/Login';
import '../../css/admin/MenuAdmin.css';
import UserAdmin from './UserAdmin';

function MenuAdmin() {
  return (
    <div className="admin-container">
      <Router>
        {/* Menu cố định bên trái */}
        <nav className="menu-admin">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/user" className={({ isActive }) => (isActive ? "active" : "")}>
                Xem người dùng
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/product" className={({ isActive }) => (isActive ? "active" : "")}>
                Product
              </NavLink>
            </li>
            <li>
              <NavLink to="/auth/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Login
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Nội dung thay đổi bên phải */}
        <div className="content">
          <Routes>
            <Route path="/" element={<HomeAdmin />} />
            <Route path="/admin/user" element={<UserAdmin />} />
            <Route path="/admin/product" element={<ProductAdmin />} />
            <Route path="/auth/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default MenuAdmin;
