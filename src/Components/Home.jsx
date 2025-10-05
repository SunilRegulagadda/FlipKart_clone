import NavBar from "./NavBar.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

// Custom Arrows
const NextArrow = ({ onClick }) => (
    <div className="slick-arrow slick-next" onClick={onClick} style={{ right: "-35px" }}>
        ➡
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div className="slick-arrow slick-prev" onClick={onClick} style={{ left: "-35px", zIndex: 2 }}>
        ⬅
    </div>
);

function Home() {
    const [categoryCards, setCategoryCards] = useState([]);
    const [bestDealsList, setBestDealsList] = useState([]); // array of { category, products }
    const navigate = useNavigate();

    // Carousel images (replace with Pinterest images)
    const carouselImages = [
        "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/80ed6c43325f596b.jpg?q=80",
        "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/810e8a20b67a59ed.jpeg?q=80",
        "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/80ed6c43325f596b.jpg?q=80",
        "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/e0b5fd2b1715a3fe.jpeg?q=80",
        "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/9c8b169a1c21ca88.jpeg?q=80",
        "https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/e0b5fd2b1715a3fe.jpeg?q=80",
    ];

    useEffect(() => {
        async function GetCategories() {
            let categories = await axios.get('https://dummyjson.com/products/categories');

            let shuffled = categories.data.sort(() => 0.5 - Math.random()).slice(0, 15);

            let cards = await Promise.all(
                shuffled.map(async (cat) => {
                    let res = await axios.get(cat.url + '?limit=1');
                    let product = res.data.products[0];
                    return {
                        name: cat.name,
                        slug: cat.slug,
                        url: cat.url,
                        image: product.thumbnail
                    };
                })
            );

            setCategoryCards(cards);

            // pick up to 4 random categories for separate Best Deals blocks
            const picks = cards.slice(0).sort(() => 0.5 - Math.random()).slice(0, Math.min(4, cards.length));
            const list = await Promise.all(picks.map(async (c) => {
                try {
                    const res = await axios.get(`https://dummyjson.com/products/category/${c.slug}?sortBy=price&order=asc&limit=12`);
                    return { category: c, products: res.data.products };
                } catch (err) {
                    console.error('Failed to load category products for', c.slug, err);
                    return { category: c, products: [] };
                }
            }));
            setBestDealsList(list);
        }

        GetCategories();
    }, []);

    const handleCardClick = (slug) => {
        navigate(`/category/${slug}`);
    }

    // Slick settings
    const settingsAuto = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const settingsDeals = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: false,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
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

            {/* Categories */}
            <div className="categories" style={{ paddingTop: "70px" }}>
                {categoryCards.map((cat, index) => (
                    <div key={index} className="card" onClick={() => handleCardClick(cat.slug)} style={{ cursor: 'pointer' }}>
                        <img src={cat.image} alt={cat.name} className="imgProduct" />
                        <div className="cardName">{cat.name}</div>
                    </div>
                ))}
            </div>

            {/* Top Carousel */}
            <div className="carousel-container" style={{ margin: "20px" }}>
                <Slider {...settingsAuto}>
                    {carouselImages.map((img, index) => (
                        <div key={index}>
                            <img src={img} alt={`slide-${index}`} style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "10px" }} />
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Best Deals Section - multiple categories */}
            {bestDealsList.length > 0 && bestDealsList.map((bd) => (
                <div key={bd.category.slug} style={{ margin: "40px 20px" }} className="sortbyprice">
                    <h2>Best Deals from this Category: {bd.category.name}</h2>
                    <Slider {...settingsDeals} responsive={[
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 2,
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            }
                        }
                    ]}>
                        {bd.products.map((prod) => (
                            <div key={prod.id} style={{ padding: "10px" }}>
                                <div style={{ border: "1px solid #ddd", borderRadius: "6px", textAlign: "center", padding: "10px" }}>
                                    <img src={prod.thumbnail} alt={prod.title} style={{ width: "100%", objectFit: "contain" }} />
                                    <h4 style={{ fontSize: "14px", marginTop: "10px" }}>{prod.title}</h4>
                                    <p style={{ fontSize: "12px", color: "black" }}>₹ {prod.price}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            ))}

            {/* 6 Image Grid Section */}
            <div className="image-grid">
                {[
                    "https://rukminim1.flixcart.com/fk-p-flap/520/280/image/0f0174a5293f53da.jpg?q=80",
                    "https://rukminim1.flixcart.com/fk-p-flap/520/280/image/bb2abb582c93143d.jpg?q=80",
                    "https://rukminim1.flixcart.com/fk-p-flap/520/280/image/4ea342b2112a0b20.jpg?q=80",
                    "https://rukminim1.flixcart.com/fk-p-flap/520/280/image/6c389c7c373280bf.jpg?q=80",
                    "https://rukminim1.flixcart.com/fk-p-flap/520/280/image/f6af21bc5209c658.jpg?q=80",
                    "https://rukminim1.flixcart.com/fk-p-flap/520/280/image/b19125ed6eb0c109.jpg?q=80",
                ].map((img, index) => (
                    <div key={index} className="grid-card">
                        <img src={img} alt={`grid-${index}`} />
                    </div>
                ))}
            </div>

           
                
        </div>


    );
}

export default Home;
