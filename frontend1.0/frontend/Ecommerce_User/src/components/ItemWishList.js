import React, { useState, useEffect } from "react";
import wish from "../images/wish.svg";
import heartSvg from "../images/heart.png";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { base_url_image } from "../utils/axiosConfig";

const ItemWishList = ({ item, index, location, grid, addToWish }) => {
  const [heart, setHeart] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Load wishlist state from localStorage on component mount
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isInWishlist = savedWishlist.includes(item?._id);
    setHeart(isInWishlist);
  }, [item?._id]);

  const totalRating = item?.totalrating || 0;
  const description = item?.description || "No description available";
  const price = item?.price || 0;
  const brand = item?.brand?.title || "Unknown Brand";
  const title = item?.title || "Untitled";

  const handleWishlistToggle = () => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (heart) {
      const newWishlist = savedWishlist.filter((id) => id !== item?._id);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    } else {
      savedWishlist.push(item?._id);
      localStorage.setItem("wishlist", JSON.stringify(savedWishlist));
    }

    setHeart(!heart);
    addToWish(item?._id);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      style={{
        width: "19.5%", // Slightly increased from 20%
        maxWidth: "260px", // Increased from 240px
        minWidth: "210px", // Increased from 200px
        padding: "6px", // Reduced from 10px to decrease gap between cards
        opacity: item.quantity === 0 ? 0.7 : 1,
        zIndex: 1,
        transition: "transform 0.3s ease",
      }}
      className="product-item"
    >
      <div 
        className="product-card position-relative" 
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }}
      >
        <div className="wishlist-icon position-absolute" style={{ top: "10px", right: "10px", zIndex: 2 }}>
          <button 
            className="border-0 bg-transparent"
            style={{ 
              backgroundColor: "rgba(255,255,255,0.8)", 
              borderRadius: "50%", 
              width: "36px", 
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <img
              onClick={handleWishlistToggle}
              src={heart ? heartSvg : wish}
              alt="wishlist"
              style={{ width: "20px", height: "20px" }}
            />
          </button>
        </div>

        {item.quantity === 0 && (
          <div
            style={{
              position: "absolute",
              right: "10px",
              top: "55px",
              background: "#ff4d4f",
              padding: "4px 8px",
              borderRadius: "4px",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            <span>Hết hàng</span>
          </div>
        )}

        <Link
          to={`/product/${item?._id}`}
          className="text-decoration-none text-dark"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div 
            className="product-image" 
            style={{ 
              position: "relative", 
              height: "190px", // Increased from 180px
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderBottom: "1px solid #eee"
            }}
          >
            <img
              src={imageError ? `https://placehold.co/300x200?text=${encodeURIComponent(title)}` : `${base_url_image}${item?.images}`}
              className="img-fluid"
              alt="product image"
              style={{ 
                maxHeight: "160px", // Increased from 150px
                maxWidth: "100%", 
                objectFit: "contain" 
              }}
              onError={handleImageError}
            />
          </div>
          
          <div 
            className="product-details"
            style={{ 
              padding: "12px 15px",
              flex: 1,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <h6 
              className="brand"
              style={{ 
                fontSize: "13px", 
                color: "#777", 
                margin: "0 0 5px 0",
                fontWeight: "500" 
              }}
            >
              {brand}
            </h6>
            
            <h5 
              className="product-title"
              style={{ 
                fontSize: "15px", 
                fontWeight: "600", 
                marginBottom: "8px",
                lineHeight: "1.4",
                height: "42px", // Limit to ~2 lines
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical"
              }}
            >
              {title}
            </h5>
            
            <div style={{ marginBottom: "8px" }}>
              <ReactStars
                count={5}
                size={18}
                value={totalRating}
                edit={false}
                activeColor="#ffd700"
              />
            </div>
            
            <p 
              className={`description ${grid === 12 ? "d-block" : "d-none"}`}
              dangerouslySetInnerHTML={{ __html: description }}
              style={{ display: "none" }}
            ></p>
            
            <p 
              className="price"
              style={{ 
                fontSize: "16px", 
                fontWeight: "700", 
                color: "#e94560",
                marginTop: "auto",
                marginBottom: "0"
              }}
            >
              {Math.round(Number(price || 0))?.toLocaleString()} VND
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ItemWishList;