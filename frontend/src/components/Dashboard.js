import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userUuid, setUserUuid] = useState('');
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const navigate = useNavigate();

  // Decode token for "Role" and "userUuid"
  useEffect(() => {
    const decodeToken = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);
          setUserUuid(decodedToken.userUuid);
        }
      } catch (error) {
        setError('Failed to decode token.');
        console.error('Error decoding token:', error);
      }
    };
    decodeToken();
  }, []);

  // [ADMIN] : "Add Product" button
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/products/add', newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const addedProduct = response.data;

      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', description: '', price: '', image: '' });
      setShowForm(false);
    } catch (error) {
      setError('Failed to add product.');
      console.error('Error adding product:', error);
    }
  };

  // [ADMIN] : Check updates for products changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Navigate to "Order.js" on "My Orders" button click
  const handleBroadcastOrders = () => {
    navigate('/broadcast-orders', { state: { userRole, userUuid } });
  };

 
  return (
    <div className="dashboard-container">
      {userRole.includes('ROLE_ADMIN') && (
        <div className="dashboard-grid">
          {/* Admin Actions */}
          <div className="dashboard-actions">
            {/* Add Product Form */}
            <div className="dashboard-admin-section">
              <button className="dashboard-toggle-form" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add Product'}
              </button>
              {showForm && (
                <form className="dashboard-product-form" onSubmit={handleAddProduct}>
                  <div className="dashboard-product-form-field">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="dashboard-product-form-field">
                    <label>Description</label>
                    <input
                      type="text"
                      name="description"
                      value={newProduct.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="dashboard-product-form-field">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="dashboard-product-form-field">
                    <label>Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={newProduct.image}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="dashboard-submit-button">Submit</button>
                </form>
              )}
            </div>

            {/* All Orders Button */}
            <div className="dashboard-admin-section">
              <button className="dashboard-admin-button" onClick={handleBroadcastOrders}>
                Broadcast Orders
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );



};

export default Dashboard;