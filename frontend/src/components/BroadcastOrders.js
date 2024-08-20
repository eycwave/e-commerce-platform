import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './BroadcastOrders.css';

const BroadcastOrders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [botCount, setBotCount] = useState(0);

    // Fetch existing orders when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setOrders(response.data.reverse());
                fetchProducts(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // Fetch products based on the given orders
    const fetchProducts = async (orders) => {
        const productPromises = orders.flatMap(order =>
            (order.productUuids || []).map(productUuid =>
                axios.get(`http://localhost:8080/api/products/get/${productUuid}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }).then(response => ({
                    uuid: productUuid,
                    ...response.data
                }))
            )
        );
        try {
            const productResponses = await Promise.all(productPromises);
            const productMap = productResponses.reduce((acc, product) => {
                acc[product.uuid] = product;
                return acc;
            }, {});
            setProducts(prevProducts => ({
                ...prevProducts,
                ...productMap
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Set up WebSocket and STOMP client
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                // Subscribe to the STOMP topic
                stompClient.subscribe('/topic/orders', (message) => {
                    const order = JSON.parse(message.body);
                    setOrders(prevOrders => {
                        const newOrders = [order, ...prevOrders];
                        fetchProducts(newOrders);
                        return newOrders;
                    });
                });
            },
            onStompError: (frame) => {
                console.error(`STOMP error: ${frame.headers['message']}`);
            },
            onWebSocketError: (error) => {
                console.error(`WebSocket error: ${error}`);
            }
        });

        // Activate the STOMP client
        stompClient.activate();

        // Cleanup (on component unmount)
        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, []);

    // [ADMIN] : "Start Bots" button
    const handleStartBots = async () => {
        try {
            const token = localStorage.getItem('token');
    
            // Save Bots
            const saveResponse = await axios.post(
                'http://localhost:8080/api/bots/save',
                botCount,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
    
            console.log('Bots saved successfully:', saveResponse.data);
    
            // If bots were saved successfully, proceed to place orders
            if (saveResponse.status === 201) {
                for (let i = 0; i < botCount; i++) {
                    await placeOrder(token);
                    await delay(50000); // 1000 milliseconds = 1 second
                }
                console.log('All orders placed successfully.');
            }
        } catch (error) {
            console.error('Error during bot start process:', error);
        }
    };
    
    // Function to place an order
    const placeOrder = async (token) => {
        try {
            await axios.post(
                'http://localhost:8080/api/bots/place-orders',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Order placed successfully');
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };
    
    // Function to introduce a delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Function to handle order status change
    const handleStatusChange = async (orderUuid) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/orders/change-status/${orderUuid}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const newStatus = response.data.orderStatus;
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.uuid === orderUuid ? { ...order, orderStatus: newStatus } : order
                )
            );
            console.log('Order status updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };
    
    const handleBotCountChange = (e) => {
        setBotCount(e.target.value);
    };

    return (
        <div className="orders-container">
            {/* Start Bots Button */}
            <div className="broadcast-admin-section">
                <h1>Broadcast Orders</h1>
                <div className="bot-control">
                    <input
                        type="number"
                        value={botCount}
                        onChange={handleBotCountChange}
                        placeholder="Enter bot count"
                        className="bot-count-input"
                    />
                    <button className="broadcast-admin-button" onClick={() => handleStartBots(botCount)}>
                        Start Bots
                    </button>
                </div>
            </div>

            {orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.uuid} className="order-card">
                        <div className="order-header">
                            <div className="order-number">Order Number: {order.orderNumber}</div>
                            <div className="order-date">Order Date: {new Date(order.orderDate).toLocaleDateString()}</div>
                            
                            <div className="order-status">
                                Status: {order.orderStatus}
                                <button onClick={() => handleStatusChange(order.uuid, 'NewStatus')} className="status-change-button">
                                    Change Status
                                </button>
                            </div>
                            
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
                <p>No orders available.</p>
            )}
        </div>
    );
};

export default BroadcastOrders;
