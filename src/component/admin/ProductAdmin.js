import React, { useEffect, useState } from "react";
import "../../css/admin/ProductAdmin.css";
import logo from "../../logo.svg";
import api from "../../service/api";
import SearchForm from "./SearchForm";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/admin/details-product`, {
      state: {
        name: selectedProduct.name,
        brand: selectedProduct.brand,
      },
    });
  };

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
      <td>
        <button className="product-admin-edit-button" onClick={handleButtonClick}>
          <img src={logo} alt="Logo" className="product-admin-logo" />
        </button>
      </td>
    </tr>
  );
}

const ProductAdmin = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [groupedData, setGroupedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate(`/admin/add-product`); // Đường dẫn tới trang chi tiết đơn hàng
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const closeForm = () => {
    setIsFormVisible(false);
  };

  useEffect(() => {
    api
      .get("/products")
      .then((response) => {
        const data = groupByBrandAndName(response.data.result);
        setGroupedData(data);
        setFilteredData(data); // Khi mới load, hiển thị tất cả dữ liệu
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
  }, []);

  const updateProductData = (updatedProduct) => {
    setGroupedData((prevData) =>
      prevData.map((group) => ({
        ...group,
        products: group.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        ),
      }))
    );
    setFilteredData((prevData) =>
      prevData.map((group) => ({
        ...group,
        products: group.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        ),
      }))
    );
  };

  const handleSearch = (searchData) => {
    const { name, brand, minPrice, maxPrice } = searchData;

    const filtered = groupedData.filter((group) => {
      return group.products.some((product) => {
        // Kiểm tra tên và thương hiệu
        const matchesName = name ? product.name.toLowerCase().includes(name.toLowerCase()) : true;
        const matchesBrand = brand ? product.brand.toLowerCase().includes(brand.toLowerCase()) : true;
        
        // Kiểm tra giá
        const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
        const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;

        return matchesName && matchesBrand && matchesMinPrice && matchesMaxPrice;
      });
    });

    setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
  };

  return (
    <div className="product-admin-container">
      <h1 className="product-admin-title">
        Quản lý sản phẩm
        <div>
          <button onClick={handleAdd}>+</button>
          <button onClick={toggleFormVisibility}>0</button>
        </div>
      </h1>
      <table className="product-admin-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Thương hiệu</th>
            <th>Màu sắc</th>
            <th>Trạng thái</th>
            <th>Tùy chỉnh</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <ProductRow
              key={`${item.name}_${item.brand}`}
              products={item.products}
              updateProductData={updateProductData}
            />
          ))}
        </tbody>
      </table>
      <SearchForm isVisible={isFormVisible} onClose={closeForm} onSubmit={handleSearch} />
    </div>
  );
};



export default ProductAdmin;
