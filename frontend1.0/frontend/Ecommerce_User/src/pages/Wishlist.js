import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getUserProductWishlist } from "../features/user/userSlice";
import { addToWishlist } from "../features/products/productSlice";
import watch from "../images/watch.jpg";
import { base_url_image } from "../utils/axiosConfig";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    getWishlistFromDb();
  }, []);

  const getWishlistFromDb = () => {
    dispatch(getUserProductWishlist());
  };

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  const removeFromWishlist = (id) => {
    // Add id to removing state to show animation
    setRemovingIds(prev => [...prev, id]);
    
    // Update localStorage
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const newWishlist = savedWishlist.filter(itemId => itemId !== id);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    
    // Update Redux state
    dispatch(addToWishlist(id));
    
    // Refresh wishlist after animation
    setTimeout(() => {
      dispatch(getUserProductWishlist());
      setRemovingIds(prev => prev.filter(itemId => itemId !== id));
    }, 300);
  };

  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h2 style={{ 
                fontSize: "24px", 
                fontWeight: "600", 
                marginBottom: "20px",
                position: "relative",
                paddingBottom: "10px"
              }}>
                Sản phẩm yêu thích
                <span style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "50px",
                  height: "3px",
                  background: "#e94560"
                }}></span>
              </h2>

              {wishlistState && wishlistState.length === 0 && (
                <div className="text-center p-5 bg-light rounded">
                  <div className="fs-4 mb-3">Chưa có sản phẩm yêu thích nào</div>
                  <Link to="/product" className="btn btn-solid" style={{
                    background: "#e94560",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    fontWeight: "500"
                  }}>
                    Tiếp tục mua sắm
                  </Link>
                </div>
              )}

              <div style={{ 
                display: "flex", 
                flexDirection: "row", 
                flexWrap: "wrap",
                justifyContent: "flex-start",
                margin: "0 -6px",
                gap: "0"
              }}>
                {wishlistState &&
                  wishlistState?.map((item, index) => {
                    let img = item?.images ? base_url_image + item?.images : watch;
                    const isRemoving = removingIds.includes(item?._id);
                    
                    return (
                      <div 
                        key={index}
                        style={{
                          width: "19.5%",
                          maxWidth: "260px",
                          minWidth: "210px",
                          padding: "6px",
                          transition: "all 0.3s ease",
                          opacity: isRemoving ? 0 : 1,
                          transform: isRemoving ? "scale(0.9)" : "scale(1)"
                        }}
                      >
                        <div 
                          className="wishlist-card position-relative"
                          style={{
                            border: "1px solid #e5e5e5",
                            borderRadius: "10px",
                            overflow: "hidden",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                            height: "100%",
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
                          <button
                            onClick={() => {
                              removeFromWishlist(item?._id);
                            }}
                            className="position-absolute bg-transparent border-0"
                            style={{ 
                              top: "10px", 
                              right: "10px", 
                              zIndex: 2,
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
                              src="/images/cross.svg"
                              alt="remove"
                              style={{ width: "14px", height: "14px" }}
                            />
                          </button>
                          
                          <Link to={`/product/${item?._id}`} className="text-decoration-none text-dark">
                            <div 
                              className="wishlist-card-image"
                              style={{ 
                                position: "relative", 
                                height: "190px", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                padding: "15px",
                                backgroundColor: "#f9f9f9",
                                borderBottom: "1px solid #eee"
                              }}
                            >
                              <img
                                src={img}
                                className="img-fluid"
                                alt="product"
                                style={{ 
                                  maxHeight: "160px", 
                                  maxWidth: "100%", 
                                  objectFit: "contain" 
                                }}
                              />
                            </div>
                            
                            <div className="wishlist-card-details p-3">
                              <h5 
                                className="title"
                                style={{ 
                                  fontSize: "15px", 
                                  fontWeight: "600", 
                                  marginBottom: "8px",
                                  lineHeight: "1.4",
                                  height: "42px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: "2",
                                  WebkitBoxOrient: "vertical"
                                }}
                              >
                                {item?.title}
                              </h5>
                              <h6 
                                className="price"
                                style={{ 
                                  fontSize: "16px", 
                                  fontWeight: "700", 
                                  color: "#e94560",
                                  marginBottom: "0"
                                }}
                              >
                                {Math.round(Number(item?.price || 0))?.toLocaleString()} VND
                              </h6>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Wishlist;