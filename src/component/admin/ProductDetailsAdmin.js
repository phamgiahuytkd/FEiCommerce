import React, { useState, useEffect } from "react";
import "../../css/admin/ProductDetailsAdmin.css";
import api from "../../service/api";
import { useLocation } from "react-router-dom";

function ProductDetailsAdmin() {
  const location = useLocation();
  const { name, brand } = location.state || {};
  const [details, setDetails] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [initialName, setInitialName] = useState(name); // Lưu tên ban đầu
  const [initialBrand, setInitialBrand] = useState(brand); // Lưu thương hiệu ban đầu

  useEffect(() => {
    api
      .post("/products/search", { name, brand })
      .then((response) => {
        const productList = response.data.result;
        setDetails(productList);
        if (productList.length > 0) {
          setSelectedProduct(productList[0]); // Chọn sản phẩm đầu tiên mặc định
        }
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Có lỗi xảy ra.");
      });
  }, [name, brand]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: value,
    });
  };

  const handleColorClick = (color) => {
    const newProduct = details.find((product) => product.colour === color);
    if (newProduct) {
      setSelectedProduct(newProduct);
    }
  };

  const handleStockChange = () => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        stock: selectedProduct.stock === 1 ? 0 : 1, // Chuyển đổi giữa 1 và 0
      });
    }
  };

  if (!selectedProduct) {
    return <p>Đang tải chi tiết sản phẩm...</p>;
  }

  const handleUpdate = (event) => {
    // Gửi yêu cầu API để cập nhật tất cả sản phẩm
    event.preventDefault();

    console.log(initialBrand);
    console.log(initialName);

    console.log(selectedProduct.brand);
    console.log(selectedProduct.name);

    // Cập nhật sản phẩm với thông tin ban đầu (brand và name không thay đổi)
    const updatedProducts = {
      brand: selectedProduct.brand,  // Sử dụng brand ban đầu
      name: selectedProduct.name,    // Sử dụng name ban đầu
      price: selectedProduct.price,
      stock: selectedProduct.stock,
    };

    api.put(`/products/update/${initialBrand}/${initialName}`, updatedProducts)
      .then(response => {
        alert("Cập nhật thành công!");
        // Cập nhật lại danh sách sản phẩm sau khi update
        setDetails(response.data.result);
      })
      .catch(error => {
        console.error("Cập nhật thất bại:", error);
        alert("Có lỗi xảy ra khi cập nhật sản phẩm");
      });
  };

  return (
    <div className="product-details-container">
      <h1>Chi tiết Sản Phẩm</h1>
      <div className="product-details">
        <div className="product-info">
          <form onSubmit={handleUpdate}>
            <label>
              <strong>Tên:</strong>
              <input
                type="text"
                name="name"
                value={selectedProduct.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Thương hiệu:</strong>
              <input
                type="text"
                name="brand"
                value={selectedProduct.brand}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Giá:</strong>
              <input
                type="number"
                name="price"
                value={selectedProduct.price}
                onChange={handleInputChange}
              />
            </label>
            <p>
              <strong>Trạng thái:</strong>
              <label className="stock-checkbox">
                <input
                  type="checkbox"
                  checked={selectedProduct.stock === 1}
                  onChange={handleStockChange}
                />
                {selectedProduct.stock === 1 ? " Còn hàng" : " Hết hàng"}
              </label>
            </p>
            <button type="submit">Thay thế</button>
          </form>
        </div>
        <div className="product-image">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="product-image-preview"
          />
        </div>
      </div>
      <div className="product-options">
        <h3>Chọn màu sắc:</h3>
        <div className="color-options">
          {details.map((product) => (
            <div
              key={product.colour}
              className={`color-box ${selectedProduct.colour === product.colour ? "selected" : ""}`}
              style={{ backgroundColor: product.colour }}
              onClick={() => handleColorClick(product.colour)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsAdmin;
