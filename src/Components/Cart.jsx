import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import Alert from "./Alert.jsx";
import { getCart, removeFromCart, updateQuantity, getCartTotal, addOrder } from "../utils/cart.js";

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadCart = () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (user) {
            const items = getCart(user.email);
            setCartItems(items);
            setTotal(getCartTotal(user.email));
            setSelectedItems(new Set());
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCart();
        const handleCartUpdate = () => loadCart();
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const handleRemove = (productId) => {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (user) {
            removeFromCart(user.email, productId);
            setAlert({ message: 'Item removed from cart.', type: 'success' });
            loadCart();
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (user) {
            updateQuantity(user.email, productId, newQuantity);
            loadCart();
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    const handleSelectItem = (productId) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedItems(newSelected);
    };

    const handlePlaceOrder = () => {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (!user) {
            setAlert({ message: "Please login to place an order.", type: "warning" });
            return;
        }
        if (selectedItems.size === 0) {
            setAlert({ message: "Please select at least one item to place an order.", type: "warning" });
            return;
        }
        const itemsToOrder = cartItems.filter(item => selectedItems.has(item.id));
        const confirmOrder = window.confirm(`Are you sure you want to place an order for ${selectedItems.size} item(s)?`);
        if (!confirmOrder) return;
        addOrder(user.email, itemsToOrder);
        // Remove ordered items from cart
        itemsToOrder.forEach(item => removeFromCart(user.email, item.id));
        setAlert({ message: "Order placed successfully! Redirecting to orders...", type: "success" });
        loadCart();
        // Dispatch event to update navbar etc
        window.dispatchEvent(new Event('orderPlaced'));
        // Redirect to orders page
        setTimeout(() => navigate('/orders'), 2000);
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
            <h2 style={{ padding: "20px" }}>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p style={{ padding: "20px" }}>Your cart is empty.</p>
            ) : (
                <div style={{ padding: "20px" }}>
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "flex",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#fff",
                                padding: "10px",
                                alignItems: "center",
                                gap: "15px",
                                marginBottom: "10px"
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedItems.has(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                                style={{ width: "20px", height: "20px" }}
                            />
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                style={{ width: "100px", height: "75px", objectFit: "cover", borderRadius: "6px" }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: "0 0 10px 0" }}>{item.title}</h3>
                                <p style={{ margin: "0", fontSize: "14px", color: "#333", fontWeight: "bold" }}>
                                    Price: ${item.price}
                                </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#f0f0f0",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#f0f0f0",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => handleRemove(item.id)}
                                style={{
                                    padding: "10px 15px",
                                    backgroundColor: "white",
                                    color: "#ff3d3d",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    borderRadius:"50%"
                                }}
                            >
                                <i className="bi bi-trash-fill"></i>
                            </button>
                        </div>
                    ))}
                    <h3 style={{ marginTop: "20px" }}>Total: ${total.toFixed(2)}</h3>
                    <button
                        onClick={handlePlaceOrder}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;
