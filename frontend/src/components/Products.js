import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import {jwtDecode} from 'jwt-decode';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState('');
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

    const decodeToken = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);
        }
      } catch (error) {
        setError('Failed to decode token.');
        console.error('Error decoding token:', error);
      }
    };

    fetchProducts();
    decodeToken();
  }, []);

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


  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      setError('Failed to delete product.');
      console.error('Error deleting product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        {userRole.includes('ROLE_ADMIN') && (
          <div className="admin-button-container">
  <button
    className="toggle-form"
    onClick={() => setShowForm(!showForm)}
  >
    {showForm ? 'Cancel' : 'Add Product'}
  </button>
  {showForm &&  (
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

      <div className="products-list">
        {products.map((product) => {
          const price = parseFloat(product.price);
          return (
            <div key={product.id} className="product-item">
              {userRole.includes('ROLE_ADMIN') && (
                <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>
                  &#10006;
                </button>
              )}
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${isNaN(price) ? 'N/A' : price.toFixed(2)}</p>
                <button onClick={() => handleAddToCart(product)}>Buy</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-container">
        <h2>Cart</h2>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>{item.name}</p>
              <p>${parseFloat(item.price).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
        <button className="create-order-button">Create Order</button>
      </div>
    </div>
  );
};

export default Products;
