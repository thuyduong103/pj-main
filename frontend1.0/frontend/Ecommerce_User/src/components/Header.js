
import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import compare from "../images/compare.svg";
import wishlist from "../images/wish.svg";
import user from "../images/user.svg";
import cart from "../images/cart.svg";
import menu from "../images/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAProduct } from "../features/products/productSlice";
import axios from "axios";
import { base_url } from "../utils/axiosConfig";
import ItemCategories from "./ItemCategories";

const Header = () => {
 const dispatch = useDispatch();
 const cartState = useSelector((state) => state?.auth?.cartProducts);
 const authState = useSelector((state) => state?.auth);
 const productState = useSelector((state) => state?.product?.products); // Changed to products
 const navigate = useNavigate();

 const [productOpt, setProductOpt] = useState([]);
 const [total, setTotal] = useState(0);
 const [dataCategories, setDataCategories] = useState([]);
 const [searchQuery, setSearchQuery] = useState("")  ;

 // Calculate cart total
 useEffect(() => {
 let sum = 0;
 if (cartState && Array.isArray(cartState)) {
 for (let index = 0; index < cartState.length; index++) {
 const item = cartState[index];
 if (item?.quantity && item?.price) {
 sum += Number(item.quantity) * Number(item.price);
 }
 }
 }
 setTotal(sum);
 }, [cartState]);

 // Prepare product options for Typeahead
 useEffect(() => {
 let data = [];
 if (Array.isArray(productState)) {
 data = productState
 .filter((product) => product?.title && product?._id)
 .map((product, index) => ({
 id: index,
 prod: product._id,
 name: product.title,
 }));
 }
 setProductOpt(data);
 }, [productState]);

 // Fetch categories (uncomment to enable on mount)
 // useEffect(() => {
 // handleGetCategories();
 // }, []);

 const handleLogout = () => {
 localStorage.clear();
 window.location.reload();
 };

 async function handleGetCategories() {
 try {
 const res = await axios.get(`${base_url}category`, {
 headers: {
 "Content-Type": "application/json",
 },
 });
 if (res.status === 200) {
 setDataCategories(res.data);
 }
 } catch (error) {
 console.error("Error fetching categories:", error);
 }
 }

 // Handle Enter key press for search
 const handleSearch = (query) => {
 if (query) {
 const matchedProduct = productOpt.find(
 (opt) => opt.name.toLowerCase() === query.toLowerCase()
 );
 if (matchedProduct) {
 navigate(`/product/${matchedProduct.prod}`);
 dispatch(getAProduct(matchedProduct.prod));
 } else {
 // Navigate to a search results page (or show no results)
 navigate(`/product?search=${encodeURIComponent(query)}`);
 }
 setSearchQuery("")  ; // Clear search input
 }
 };

 return (
 <div style={{ position: "fixed", width: "100%", zIndex: 99 }}>
 <header className="header-upper py-3">
 <div className="container-xxl">
 <div className="row align-items-center">
 <div className="col-2">
 <h2>
 <Link className="text-danger">Infinity</Link>
 </h2>
 </div>
 <div className="col-5">
 <div
 className="input-group"
 style={{ alignItems: "center", position: "relative" }}
 >
 <Typeahead
 id="search-products"
 onChange={(selected) => {
 if (selected[0]?.prod) {
 navigate(`/product/${selected[0].prod}`);
 dispatch(getAProduct(selected[0].prod));
 }
 }}
 onInputChange={(text) => setSearchQuery(text)}
 onKeyDown={(e) => {
 if (e.key === "Enter") {
 e.preventDefault();
 handleSearch(searchQuery);
 }
 }}
 options={productOpt}
 labelKey="name"
 minLength={2}
 placeholder="Search for Products here..."
 inputProps={{ style: { paddingRight: "40px" } }} // Space for search icon
 />
 <div
 style={{
 position: "absolute",
 right: 10,
 top: "50%",
 transform: "translateY(-50%)",
 }}
 >
 <BsSearch className="fs-6" />
 </div>
 </div>
 </div>
 <div className="col-5">
 <div className="header-upper-links d-flex align-items-center justify-content-between">
 <div>
 <Link
 to="/wishlist"
 className="d-flex align-items-center gap-10 text-danger"
 >
 <img src={wishlist} alt="wishlist" />
 <p className="mb-0">
 Favourite <br /> Wishlist
 </p>
 </Link>
 </div>
 <div>
 <Link
 to={authState?.user === null ? "/login" : "/my-profile"}
 className="d-flex align-items-center gap-10 text-danger"
 >
 <img src={user} alt="user" />
 {authState?.user === null ? (
 <p className="mb-0">
 Log in <br /> My Account
 </p>
 ) : (
 <p className="mb-0">
 Welcome {authState?.user?.firstname}
 </p>
 )}
 </Link>
 </div>
 <div>
 <Link
 to="/cart"
 className="d-flex align-items-center gap-10 text-danger"
 >
 <img src={cart} alt="cart" />
 <div className="d-flex flex-column gap-10">
 <span className="badge bg-white text-dark">
 {cartState?.length || 0}
 </span>
 <p className="mb-0">$ {total.toLocaleString()}</p>
 </div>
 </Link>
 </div>
 </div>
 </div>
 </div>
 </div>
 </header>
 <header className="header-bottom py-3">
 <div className="container-xxl">
 <div className="row">
 <div className="col-12">
 <div className="menu-bottom d-flex align-items-center gap-30">
 <div>
 <div className="dropdown">
 <button
 className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
 type="button"
 onClick={handleGetCategories}
 id="dropdownMenuButton1"
 data-bs-toggle="dropdown"
 aria-expanded="false"
 >
 <img src={menu} alt="menu" />
 <span className="me-5 d-inline-block">
 Shop Categories
 </span>
 </button>
 <ul
 className="dropdown-menu"
 aria-labelledby="dropdownMenuButton1"
 >
 {dataCategories.map((itemCategories) => (
 <ItemCategories
 key={itemCategories._id}
 itemCategories={itemCategories}
 />
 ))}
 </ul>
 </div>
 </div>
 <div className="menu-links">
 <div className="d-flex align-items-center gap-15">
 <NavLink to="/">Home</NavLink>
 <NavLink to="/product">Our Store</NavLink>
 <NavLink to="/my-orders">My Orders</NavLink>
 <button
 onClick={handleLogout}
 className="border border-0 bg-transparent text-white text-uppercase"
 type="button"
 >
 Logout
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </header>
 </div>
 );
};

export default Header;