import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';
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

  /* Product Operations */
  // Fetch "Products" directly from DB.
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

  /* Cart Operations */
  const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await axios.get(`/api/carts/user/${userUuid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { uuid, productList } = response.data;
      setCartUuid(uuid);
      setCart(productList || []);
      setTotalPrice(calculateTotalPrice(productList || []));
    } catch (error) {
      setError('Failed to fetch cart.');
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    if (userUuid) {
      fetchCart();
    }
  }, [userUuid]);

  // Add product to cart
  const handleAddToCart = async (product) => {
    try {
      const response = await axios.get(`/api/carts/user/${userUuid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { uuid, productList } = response.data;
      const updatedProductList = [...(productList || []), product];

      await axios.put(`/api/carts/update/${uuid}`, {
        uuid,
        productUuids: updatedProductList.map((p) => p.uuid),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCart(updatedProductList);
      setCartUuid(uuid);
      setTotalPrice(calculateTotalPrice(updatedProductList));
    } catch (error) {
      setError('Failed to add product to cart.');
      console.error('Error adding to cart:', error);
    }
  };

  // Reset cart
  const resetCart = async () => {
    try {
      if (userUuid) {
        await axios.put(`/api/carts/reset/${userUuid}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCart([]);
        setCartUuid('');
        setTotalPrice(0);
      }
    } catch (error) {
      setError('Failed to reset the cart.');
      console.error('Error resetting the cart:', error);
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
      const response = await axios.post('/api/orders/save', orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      resetCart();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('You already have an order in processing. Please wait for it to be completed before creating a new one.');
      } else {
        setError('Failed to create order.');
      }
      console.error('Error creating order:', error);
    }
    resetCart();
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container">
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
                <button className="buy-button" onClick={() => handleAddToCart(product)}>
                  Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Container */}
      <div className="cart-container">
        <div className="cart-header">
          <h2>Cart</h2>
          <button className="reset-cart-button" disabled={cart.length === 0} onClick={resetCart}>
            Reset Cart
          </button>
        </div>
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
    </div>
  );
};

export default Home;