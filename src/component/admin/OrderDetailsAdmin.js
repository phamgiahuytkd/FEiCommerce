import React, { useEffect, useState } from "react";
import "../../css/admin/OrderDetailsAdmin.css";
import api from "../../service/api";
import { useParams } from "react-router-dom";



function getStatusDisplay(status) {
  switch (status.toLowerCase()) {
    case "processing":
      return "Đang xử lý";
    case "approved":
      return "Đã duyệt";
    case "refused":
      return "Bị từ chối";
    case "cancelled":
      return "Đã hủy";
    default:
      return status; // Giữ nguyên giá trị mặc định nếu không khớp
  }
}


function OrderDetailsAdmin() {

  const { orderId } = useParams(); // Lấy ID đơn hàng từ URL
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Fetch chi tiết đơn hàng theo ID
    api.get(`/order/${orderId}`)
      .then(response => {
        setOrderDetails(response.data.result);
      })
      .catch(error => {
        console.error(error.response.data.message);
      });
  }, [orderId]);

  const handleDecide = (decide) => {
    // Thêm logic xử lý từ chối đơn hàng (API call)
    api.put(`/order/${orderId}`, { order_status: decide })
          .catch(error => {
            alert(error.response.data.message);
          });

    if(decide === "REFUSED")
        alert("Đơn hàng đã bị từ chối!");
    else if(decide === "APPROVED")
        alert("Đơn hàng đã được chấp nhận!");

    window.location.href = "/admin/order";


  };


  if (!orderDetails) {
    return <div>Loading...</div>;
  }



  return (
    <div className="order-details-admin-container">
      <h1>Chi tiết đơn hàng</h1>
      <div className="order-info">
        <p><strong>ID Đơn hàng:</strong> {orderDetails.id}</p>
        <p><strong>Ngày đặt:</strong> {new Date(orderDetails.order_date).toLocaleString()}</p>
        <p><strong>Địa chỉ giao hàng:</strong> {orderDetails.shipping_address}</p>
        <p><strong>Số điện thoại:</strong> {orderDetails.order_phone}</p>
        <p><strong>Trạng thái:</strong> <span className={`order-admin-status ${orderDetails.order_status.toLowerCase()}`}>{getStatusDisplay(orderDetails.order_status)}</span></p>
      </div>
      <table className="order-details-admin-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(orderDetails.productsList).map((product) => (
            <tr key={product.product_id}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.price.toLocaleString()} VND</td>
              <td>{product.amount.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="order-details-admin-actions">
        <div className="order-details-admin-total-amount">
          <strong>Tổng tiền:</strong> {orderDetails.amount.toLocaleString()} VND
        </div>
        {orderDetails.order_status === 'PROCESSING' ? (
        <div>
            <button className="order-details-admin-accept-button" onClick={() => handleDecide("APPROVED")}>Chấp nhận</button>
            <button className="order-details-admin-reject-button" onClick={() => handleDecide("REFUSED")}>Từ chối</button>
        </div>
        ) : null}
      </div>
    </div>
  );
}

export default OrderDetailsAdmin;
