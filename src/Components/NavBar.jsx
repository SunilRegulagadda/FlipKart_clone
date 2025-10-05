import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NavBar.css';
import logo from '../assets/NavLogo.png';
import { getCartCount, hasOrders } from '../utils/cart.js';

function NavBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [ordersExist, setOrdersExist] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const res = await axios.get(`https://dummyjson.com/products/search?q=${searchTerm}`);
                setSuggestions(res.data.products.slice(0, 5)); // show top 5 suggestions
            } catch (err) {
                console.error(err);
            }
        };

        fetchSuggestions();
    }, [searchTerm]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        setLoggedInUser(user);
        if (user) {
            const count = getCartCount(user.email);
            setCartCount(count);
            setOrdersExist(hasOrders(user.email));
        } else {
            setCartCount(0);
            setOrdersExist(false);
        }
    }, []);

    useEffect(() => {
        const handleCartUpdate = () => {
            const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
            if (user) {
                const count = getCartCount(user.email);
                setCartCount(count);
                setOrdersExist(hasOrders(user.email));
            } else {
                setCartCount(0);
                setOrdersExist(false);
            }
        };
        const handleOrderPlaced = () => {
            const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
            if (user) {
                setOrdersExist(true);
            }
        };
        const handleOrderCancelled = () => {
            const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
            if (user) {
                setOrdersExist(hasOrders(user.email));
            } else {
                setOrdersExist(false);
            }
        };
        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('orderPlaced', handleOrderPlaced);
        window.addEventListener('orderCancelled', handleOrderCancelled);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('orderPlaced', handleOrderPlaced);
            window.removeEventListener('orderCancelled', handleOrderCancelled);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            const slug = searchTerm.trim().toLowerCase().replace(/\s+/g, "-");
            navigate(`/search/${slug}`);
            setSearchTerm('');
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (title) => {
        const slug = title.toLowerCase().replace(/\s+/g, "-");
        navigate(`/search/${slug}`);
        setSearchTerm('');
        setSuggestions([]);
    };

    return (
        <nav className="nav-bar">
            <div className="nav-container">
                <a href="#" className="nav-logo-link">
                    <img src={logo} alt="Flipkart Logo" className="nav-logo" />
                </a>

                <div style={{ position: "relative", width: "100%" }}>
                    <form className="search-form" role="search" onSubmit={handleSearchSubmit}>
                        <button type="submit" className="search-icon-btn">
                            <i className="bi bi-search"></i>
                        </button>
                        <input
                            className="search-input"
                            type="search"
                            placeholder="Search for Products, Brands and More"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    {suggestions.length > 0 && (
                        <div style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            background: "white",
                            border: "1px solid #ddd",
                            zIndex: 1000
                        }}>
                            {suggestions.map(prod => (
                                <div
                                    key={prod.id}
                                    style={{
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #eee"
                                    }}
                                    onClick={() => handleSuggestionClick(prod.title)}
                                >
                                    {prod.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="nav-links">
                    {loggedInUser ? (
                        <>
                            <div
                                className="nav-link-item username-display"
                                style={{ color: 'green' }}
                            >
                                <i className="bi bi-person-circle"></i>{loggedInUser.name}
                            </div>

                            <div className="nav-link-item cart">
                                <a href="/cart"><i className="bi bi-cart"></i> Cart <span className='count'>{cartCount}</span></a>
                            </div>

                            {ordersExist && (
                                <div className="nav-link-item orders" style={{ marginLeft: "10px", color: 'orange', fontWeight: 'bold' }}>
                                    <a href="/orders"><i className="bi bi-bag-check"></i> Orders</a>
                                </div>
                            )}


                        </>
                    ) : (
                        <>
                            <div className="nav-link-item login-dropdown">
                                <a href="/login"><i className="bi bi-person-circle"></i> Login</a>
                            </div>
                            <div className="nav-link-item cart">
                                <a href="/cart"><i className="bi bi-cart"></i> Cart</a>
                            </div>
                        </>
                    )}
                    <div className="nav-link-item seller ">
                        <a href="https://seller.flipkart.com/sell-online?utm_source=fkwebsite&utm_medium=websitedirect"><i className="bi bi-shop-window"></i> Become a Seller</a>
                    </div>
                    <div className="nav-link-item more-options dropdown">
                        <a
                            href="#"
                            className="dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ textDecoration: "none" }}
                            onClick={(e) => e.preventDefault()}
                        >
                            <i className="bi bi-three-dots-vertical"></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => window.open("/about", "_blank")}
                                >
                                    About this project
                                </button>
                            </li>
                        </ul>
                    </div>


                </div>
            </div>
        </nav>
    )
}

export default NavBar;
