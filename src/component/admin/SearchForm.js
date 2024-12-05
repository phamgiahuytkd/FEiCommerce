import React, { useState } from "react";
import "../../css/admin/SearchForm.css"; // Thêm file CSS cho hiệu ứng

const SearchForm = ({ onSubmit, isVisible, onClose }) => {
    const [formData, setFormData] = useState({
      name: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
  
      // Kiểm tra giá nhập vào không phải là số âm
      if (name === "minPrice" || name === "maxPrice") {
        if (value < 0) {
          return; // Nếu giá là số âm, không cho phép thay đổi
        }
      }
  
      setFormData({ ...formData, [name]: value });
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
  
      // Kiểm tra điều kiện: giá cao nhất phải >= giá thấp nhất
      if (formData.minPrice && formData.maxPrice && parseFloat(formData.maxPrice) < parseFloat(formData.minPrice)) {
        alert("Giá cao nhất phải lớn hơn hoặc bằng giá thấp nhất.");
        return; // Dừng submit nếu không hợp lệ
      }
  
      if (onSubmit) {
        onSubmit(formData); // Gửi dữ liệu lên trang cha
      }
    };
  
    return (
      <div className={`form-search-container ${isVisible ? "visible" : ""}`}>
        <button className="search-close-btn" onClick={onClose}>
          ×
        </button>
        <h3>Tìm kiếm sản phẩm</h3>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>Tên sản phẩm:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên sản phẩm"
            />
          </div>
  
          <div>
            <label>Hãng:</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Nhập hãng"
            />
          </div>
  
          <div>
            <label>Giá thấp nhất:</label>
            <input
              type="number"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
  
          <div>
            <label>Giá cao nhất:</label>
            <input
              type="number"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
  
          <button type="submit">Tìm kiếm</button>
        </form>
      </div>
    );
  };
  

export default SearchForm;
