import React, { useEffect, useState } from "react";
import "../../css/admin/ProductAdmin.css";
import logo from "../../logo.svg"
import api from "../../service/api";


const groupByBrandAndName = (items) => {
  const groupedItems = {};

  items.forEach(item => {
      const key = `${item.name}_${item.brand}`; // Unique key based on name and brand
      if (!groupedItems[key]) {
          groupedItems[key] = {
              name: item.name,
              brand: item.brand,
              products: [item], // Lưu toàn bộ object sản phẩm
          };
      } else {
          groupedItems[key].products.push(item);
      }
  });

  return Object.values(groupedItems); // Convert object to array
};


function ProductRow({ products, updateProductData }) {
  const [selectedProduct, setSelectedProduct] = React.useState(products[0]); // Default to the first product

  const handleColorChange = (colour) => {
    const newProduct = products.find(product => product.colour === colour);
    setSelectedProduct(newProduct);
    updateProductData(newProduct); // Gọi hàm updateProductData để cập nhật lại dữ liệu ở cấp cao hơn
  };

  const handleStockChange = () => {
    const updatedStock = selectedProduct.stock === 0 ? 1 : 0; // Toggle stock between 0 and 1

    // Cập nhật trạng thái sản phẩm trên giao diện
    setSelectedProduct(prevProduct => ({
      ...prevProduct,
      stock: updatedStock,
    }));

    // Gửi request PUT để cập nhật trạng thái stock
    api.put(`/products/view/${selectedProduct.id}`, { stock: updatedStock })
      .then(response => {
        
        updateProductData({ ...selectedProduct, stock: updatedStock }); // Cập nhật lại dữ liệu
      })
      .catch(error => {
        
        // Nếu có lỗi, phục hồi trạng thái về cũ
        setSelectedProduct(prevProduct => ({
          ...prevProduct,
          stock: prevProduct.stock === 0 ? 1 : 0,
        }));
      });
  };

  return (
    <tr>
      <td>
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="product-admin-image"
        />
      </td>
      <td>{selectedProduct.name}</td>
      <td>{selectedProduct.brand}</td>
      <td>
        <div className="product-admin-color-options">
          {products.map((product) => (
            <label
              key={product.id}
              className={`product-admin-color-box ${product.colour === selectedProduct.colour ? 'active' : ''}`}
              style={{ backgroundColor: product.colour }}
              onClick={() => handleColorChange(product.colour)}
            ></label>
          ))}
        </div>
      </td>
      <td>
        <label className="product-admin-switch">
          <input
            type="checkbox"
            checked={selectedProduct.stock === 1} // Nếu stock = 1, switch bật
            onChange={handleStockChange} // Gọi hàm xử lý khi người dùng nhấn vào switch
          />
          <span className="slider round"></span>
        </label>
        <span className="stock-status">
          {selectedProduct.stock === 1 ? "Còn hàng" : "Hết hàng"}
        </span>
      </td>
      <td className="product-admin-edit-container">
        <button className="product-admin-edit-button">
          <img src={logo} alt="Logo" className="product-admin-logo" />
        </button>
      </td>
    </tr>
  );
}

function ProductAdmin() {
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    api.get('/products').then(response => { 
      setGroupedData(groupByBrandAndName(response.data.result));
    })
    .catch(error => {
      console.error(error.response.data.message);
    });
  }, []);

  const updateProductData = (updatedProduct) => {
    setGroupedData(prevData => {
      // Cập nhật sản phẩm trong groupedData
      return prevData.map(group => {
        return {
          ...group,
          products: group.products.map(product => 
            product.id === updatedProduct.id ? updatedProduct : product
          )
        };
      });
    });
  };

  return (
    <div className="product-admin-container">
      <h1 className="product-admin-title">Quản lý sản phẩm</h1>
      <table className="product-admin-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Thương hiệu</th>
            <th>Màu sắc</th>
            <th>Trạng thái</th>
            <th>Tùy chỉnh</th> {/* Cột mới */}
          </tr>
        </thead>
        <tbody>
          {groupedData.map(item => (
            <ProductRow
              key={`${item.name}_${item.brand}`}
              products={item.products}
              updateProductData={updateProductData} // Truyền hàm cập nhật dữ liệu lên
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductAdmin;
