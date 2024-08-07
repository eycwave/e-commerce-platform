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
  });

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
          console.log('Decoded Token:', decodedToken); // Token'in decode edilip edilmediğini kontrol etmek için log
          setUserRole(decodedToken.role); // JWT token içinde rol bilgisi olduğunu varsayıyoruz
          console.log('User Role:', decodedToken.role); // Rol bilgisini kontrol etmek için log
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
      await axios.post('/api/products/add', newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts([...products, newProduct]);
      setNewProduct({ name: '', description: '', price: '', image: '' });
      setShowForm(false);
    } catch (error) {
      setError('Failed to add product.');
      console.error('Error adding product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">
      <h1>Products</h1>
      {userRole.includes('ROLE_ADMIN') && (
        <div className="admin-button-container">
          <button className="toggle-form" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
          {showForm && (
            <form className="form-container" onSubmit={handleAddProduct}>
              <div className="form-field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
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
      <div className="products-list">
        {products.map((product) => {
          // Sayıya dönüştürme
          const price = parseFloat(product.price);
          return (
            <div key={product.id} className="product-item">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${isNaN(price) ? 'N/A' : price.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

  


export default Products;
