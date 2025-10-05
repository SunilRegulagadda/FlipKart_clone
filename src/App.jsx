import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx";
import CategoryFilterProduct from "./Components/CategoryFilterProduct.jsx";
import Footer from "./Components/Footer.jsx";
import SearchFilterProduct from "./Components/SearchFilterProduct.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import Cart from "./Components/Cart.jsx";
import Orders from "./Components/Orders.jsx";
import About from "./Components/About.jsx";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:slug" element={<CategoryFilterProduct />} />
                    <Route path="/search/:searchTerm" element={<SearchFilterProduct />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/about' element={<About />} />
                </Routes>
            </Router>

            <Footer />
        </>
    );
}

export default App;
