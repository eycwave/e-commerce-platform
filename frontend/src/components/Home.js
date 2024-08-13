import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import {jwtDecode} from 'jwt-decode';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userUuid, setUserUuid] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [cart, setCart] = useState([]);
  const [cartUuid, setCartUuid] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

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

  // Get products directly from DB.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        setError('Failed to fetch products.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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

  // [ADMIN] : "Delete Product" button
  const handleDeleteProduct = async (productUuid) => {
    try {
      await axios.delete(`/api/products/delete/${productUuid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.uuid !== productUuid)
      );
    } catch (error) {
      setError('Failed to delete product.');
      console.error('Error deleting product:', error);
    }
  };

  // [ADMIN] : Check updates for products changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Add products to cart
  const handleAddToCart = async (product) => {
    try {
      const cartResponse = await axios.get(`/api/carts/user/${userUuid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const cartUuid = cartResponse.data.uuid;
      const existingProducts = cartResponse.data.productList || []; 
      const updatedProductList = [...existingProducts, product];
  
      const payload = {
        uuid: cartUuid,
        productUuids: updatedProductList.map((p) => p.uuid),
      };
      await axios.put(`/api/carts/update/${cartUuid}`, payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const updateCartTotals = (cartItems) => {
        return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
      };

      console.log(userUuid);
      const updatedCartResponse = await axios.get(`/api/carts/user/${userUuid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCart(updatedCartResponse.data.productList || []);
      setCartUuid(cartUuid);
      setTotalPrice(updateCartTotals(updatedCartResponse.data.productList));
    } catch (error) {
      setError('Failed to add product to cart.');
      console.error('Error adding to cart:', error);
    }
  };
  
  // Create order
  const handleCreateOrder = async () => {
    try {
      const orderPayload = {
        userUuid: userUuid,
        productUuids: cart.map((product) => product.uuid),
        totalAmount: totalPrice 
      };
  
      const token = localStorage.getItem('token');
  
      await axios.post('/api/orders/save', orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      await axios.put(`/api/carts/reset/${userUuid}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setCart([]);
      setCartUuid('');
      setTotalPrice(0);
      
      
    } catch (error) {
      setError('Failed to create order.');
      console.error('Error creating order:', error);
    }
  };

  // Navigate to "Order.js" on "My Orders" button click
  const handleMyOrdersClick = () => {
    navigate('/orders', { state: { userRole, userUuid } });
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container">
      {/* Products Header */}
      <div className="products-header">
        <h1>Products</h1>
        {userRole.includes('ROLE_ADMIN') && (
          <div className="admin-button-container">
            {/* Toggle Add Product Form */}
            <button
              className="toggle-form"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>

            {/* Add Product Form */}
            {showForm && (
              <form className="product-form-container" onSubmit={handleAddProduct}>
                <div className="product-form-field">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="product-form-field">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="product-form-field">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="product-form-field">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={newProduct.image}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Products List */}
      <div className="products-list">
        {products.map((product) => {
          const price = parseFloat(product.price);
          return (
            <div key={product.uuid} className="product-item">
              {/* Delete Button for Admin */}
              {userRole.includes('ROLE_ADMIN') && (
                <button className="delete-button" onClick={() => handleDeleteProduct(product.uuid)}>
                  &#10006;
                </button>
              )}
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${isNaN(price) ? 'N/A' : price.toFixed(2)}</p>
                <button className="buy-button" onClick={() => handleAddToCart(product)}>Buy</button>              
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Container */}
      <div className="cart-container">
        <h2>Cart</h2>
        {Array.isArray(cart) && cart.length > 0 ? (
          <>
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <p>{item.name}</p>
                <p>${parseFloat(item.price).toFixed(2)}</p>
              </div>
            ))}
            <div className="cart-totals">
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
        <button className="create-order-button" disabled={cart.length === 0} onClick={handleCreateOrder}>
          Create Order
        </button>
      </div>

      {/* My Orders Button */}
      <button className="my-orders-button" onClick={handleMyOrdersClick}>
        My Orders
      </button>
    </div>
  );
};

export default Home;