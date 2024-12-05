import React, { useState } from "react";
import "../../css/admin/ProductCreation.css"; // Thêm file CSS để styling
import api from "../../service/api";
import { useNavigate } from "react-router-dom";

function ProductCreation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    brand: "",
    colour: "#ffffff", // Mã màu mặc định (trắng)
    image: "",
    stock: 0,
    colourError: "", // Lưu lỗi nếu mã màu không hợp lệ
    isInStock: 1, // Mặc định sản phẩm có sẵn
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleColorInputBlur = (e) => {
    const value = e.target.value;
    // Regex kiểm tra mã màu HEX khi người dùng nhập xong
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (hexColorRegex.test(value) || value === "") {
      setFormData({
        ...formData,
        colour: value,
        colourError: "", // Xóa lỗi nếu mã màu hợp lệ
      });
    } else {
      setFormData({
        ...formData,
        colourError: "Mã màu không hợp lệ. Vui lòng nhập mã màu HEX hợp lệ.", // Cập nhật lỗi
      });
    }
  };

  const handleColorInputChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      colour: value,
      colourError: "", // Xóa lỗi khi thay đổi từ hộp màu
    });
  };

  const handleCheckboxChange = () => {
    setFormData({
      ...formData,
      isInStock: formData.isInStock === 1 ? 0 : 1, // Chuyển đổi giá trị 1 và 0
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bắt buộc bị thiếu
    if (!formData.name || !formData.price || !formData.brand || formData.colourError) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }

    // Gửi dữ liệu lên server để tạo sản phẩm mới
    api
      .post("/products", formData)
      .then((response) => {
        alert("Sản phẩm đã được thêm thành công!");
        navigate("/admin/products"); // Chuyển hướng về trang quản lý sản phẩm
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  return (
    <div className="product-creation-container">
      <h1>Thêm Sản Phẩm</h1>
      <form onSubmit={handleFormSubmit} className="product-creation-form">
        <div>
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        <div>
          <label>Giá:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Nhập giá sản phẩm"
            required
          />
        </div>

        <div>
          <label>Hãng:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Nhập hãng sản phẩm"
            required
          />
        </div>

        <div className="color-selection-container">
          <label>Màu sắc:</label>
          <input
            type="color"
            name="colour"
            value={formData.colour}
            onChange={handleColorInputChange}
          />
          <input
            type="text"
            name="colour"
            value={formData.colour}
            onChange={handleInputChange}
            onBlur={handleColorInputBlur} // Kiểm tra lỗi khi người dùng nhập xong và rời khỏi trường
            placeholder="Nhập mã màu (ví dụ: #ff5733)"
          />
          {formData.colourError && (
            <div className="color-error">{formData.colourError}</div>
          )}
        </div>

        <div>
          <label>Hình ảnh:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="URL hình ảnh"
          />
        </div>

        <div className="checkbox-selection-container">
        <label>Còn hàng:</label>
        <input
            type="checkbox"
            name="isInStock"
            checked={formData.isInStock === 1}
            onChange={handleCheckboxChange}
        />
        <span>{formData.isInStock === 1 ? "Có" : "Không"}</span>
        </div>


        <div>
          <button type="submit">Thêm sản phẩm</button>
        </div>
      </form>
    </div>
  );
}

export default ProductCreation;
