import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import Alert from "./Alert.jsx";
import { BiCart } from "react-icons/bi"; // cart icon

function CategoryFilterProduct() {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                let res = await axios.get(`https://dummyjson.com/products/category/${slug}`);
                setProducts(res.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [slug]);

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

            <h2 style={{ padding: "20px" }}>{slug.toUpperCase()}</h2>

            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
                    {products.map((prod) => (
                    <div
                        key={prod.id}
                        style={{
                            display: "flex",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#fff",
                            padding: "10px",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >
                        <img
                            src={prod.thumbnail}
                            alt={prod.title}
                            style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "6px" }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: "0 0 10px 0" }}>{prod.title}</h3>
                            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#555" }}>
                                {prod.description}
                            </p>
                            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#333", fontWeight: "bold" }}>
                                Price: ${prod.price} &nbsp;
                                <span style={{ fontSize: "12px", color: "green" }}>
                                    ({prod.discountPercentage}% off)
                                </span>
                            </p>
                            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#777" }}>
                                Rating: {prod.rating} | Stock: {prod.stock}
                            </p>
                            <p style={{ margin: "0", fontSize: "12px", color: "#555" }}>
                                Category: {prod.category} | Tags: {prod.tags.join(", ")}
                            </p>
                        </div>
                        <button
                            style={{
                                padding: "10px 15px",
                                backgroundColor: "#F7E00B",
                                color: "black",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "bolder",
                                gap: "5px"
                            }}
                            onClick={() => {
                                const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
                                if (!user) {
                                    setAlert({ message: 'Please login to add items to cart.', type: 'warning' });
                                    return;
                                }
                                const productToAdd = {
                                    id: prod.id,
                                    title: prod.title,
                                    price: prod.price,
                                    thumbnail: prod.thumbnail
                                };
                                import('../utils/cart.js').then(({ addToCart }) => {
                                    addToCart(user.email, productToAdd);
                                    setAlert({ message: 'Item added to cart!', type: 'success' });
                                    window.dispatchEvent(new Event('cartUpdated'));
                                });
                            }}
                        >
                            <BiCart size={18} /> Add to Cart
                        </button>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
}

export default CategoryFilterProduct;
