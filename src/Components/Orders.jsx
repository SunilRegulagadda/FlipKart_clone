import React, { useEffect, useState } from "react";
import NavBar from "./NavBar.jsx";
import { getOrders, cancelOrder } from "../utils/cart.js";

function Orders() {
    const [orders, setOrders] = useState([]);

    const loadOrders = () => {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (user) {
            const userOrders = getOrders(user.email);
            setOrders(userOrders);
        }
    };

    useEffect(() => {
        loadOrders();
        const handleOrderPlaced = () => loadOrders();
        window.addEventListener('orderPlaced', handleOrderPlaced);
        return () => window.removeEventListener('orderPlaced', handleOrderPlaced);
    }, []);

    const handleCancelOrder = (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
            if (user) {
                cancelOrder(user.email, orderId);
                loadOrders();
                // Dispatch event to update navbar if no orders left
                window.dispatchEvent(new Event('orderCancelled'));
            }
        }
    };

    return (
        <div>
            <div className="navbar-fixed" style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                zIndex: "1000"
            }}>
                <NavBar />
            </div>
            <h2 style={{ padding: "20px", marginTop: "60px" }}>Your Orders</h2>
            {orders.length === 0 ? (
                <p style={{ padding: "20px" }}>You have no orders placed.</p>
            ) : (
                <div style={{ padding: "20px" }}>
                    {orders.map(order => (
                        <div key={order.id} style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            background: "#fff",
                            padding: "10px",
                            marginBottom: "15px"
                        }}>
                            <h3>Order ID: {order.id}</h3>
                            <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
                            <p>Delivery Date: {new Date(new Date(order.orderDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString()}</p>
                            <p>Status: {order.status}</p>
                            <h4>Items:</h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {order.items.map(item => (
                                    <div key={item.id} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        border: "1px solid #eee",
                                        borderRadius: "4px",
                                        padding: "5px",
                                        background: "#f9f9f9"
                                    }}>
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }}
                                        />
                                        <div>
                                            <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold" }}>{item.title}</p>
                                            <p style={{ margin: "0", fontSize: "12px" }}>Qty: {item.quantity} - ${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => handleCancelOrder(order.id)}
                                style={{
                                    marginTop: "10px",
                                    padding: "8px 16px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel Order
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
