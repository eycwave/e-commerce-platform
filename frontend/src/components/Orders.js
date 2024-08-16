import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, userUuid } = location.state || {};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = userRole === 'ROLE_ADMIN' 
          ? `/api/orders` 
          : `/api/orders/user/${userUuid}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
        await fetchProducts(response.data); // Fetch products after orders
      } catch (error) {
        setError('Failed to fetch orders.');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async (orders) => {
      const productPromises = orders.flatMap(order =>
        (order.productUuids || []).map(productUuid =>
          axios.get(`/api/products/get/${productUuid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }).then(response => ({
            uuid: productUuid,
            ...response.data
          }))
        )
      );
      const productResponses = await Promise.all(productPromises);
      const productMap = productResponses.reduce((acc, product) => {
        acc[product.uuid] = product;
        return acc;
      }, {});
      setProducts(productMap);
    };

    fetchOrders();
  }, [userRole, userUuid]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h1>Orders</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.uuid} className="order-card">
            <div className="order-header">
              <div className="order-number">Order Number: {order.orderNumber}</div>
              <div className="order-date">Order Date: {new Date(order.orderDate).toLocaleDateString()}</div>
              <div className="order-status">Status: {order.orderStatus}</div>
            </div>
            <div className="order-products">
              {order.productUuids && order.productUuids.length > 0 ? (
                order.productUuids.map((productUuid) => {
                  const product = products[productUuid];
                  return product ? (
                    <div key={product.uuid} className="order-product">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <p><strong>Name:</strong> {product.name}</p>
                      <p><strong>Description:</strong> {product.description}</p>
                      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    </div>
                  ) : (
                    <p key={productUuid}>Loading product details...</p>
                  );
                })
              ) : (
                <p>No products available.</p>
              )}
            </div>
            <div className="order-total">
              <span className="order-total-label">Total Amount:</span>
              <span className="order-total-amount">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
};

export default Orders;
