import React, { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import BlogCard from "../components/BlogCard";
import ProductCard from "../components/ProductCard";
import SpecialProduct from "../components/SpecialProduct";
import Container from "../components/Container";
import { services } from "../utils/Data";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import { getAllProducts } from "../features/products/productSlice";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import prodcompare from "../images/prodcompare.svg";
import wish from "../images/wish.svg";
import watch2 from "../images/watch-1.avif";
import addcart from "../images/add-cart.svg";
import view from "../images/view.svg";
import { addToWishlist } from "../features/products/productSlice";
import axios from "axios";
import { base_url } from "../utils/axiosConfig";
import ItemWishList from "../components/ItemWishList";
import right from '../images/right.png'
import left from '../images/left.png'

const Home = (props) => {

  let location = useLocation();
  const { grid, data } = props;

  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state.product.product);
  const navigate = useNavigate();

  const [topProduct, setTopProduct] = useState([])

  const [dataSubCategoires, setDataSubCategoires] = useState([])

  const dispatch = useDispatch();
  useEffect(() => {
    getblogs();
    getallProducts();
    handleGetTopProduct()
    handleGetSubcategories()
  }, []);


  const getblogs = () => {
    dispatch(getAllBlogs());
  };
  const getallProducts = () => {
    dispatch(getAllProducts());
  };

  const addToWish = (id) => {
    dispatch(addToWishlist(id));
  };


  async function handleGetTopProduct() {
    axios.get(base_url + `product/top-product`, {
      params: {
        limit: 6
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setTopProduct(res.data)

    }).catch((err) => {
      setTopProduct([])

    })
  }


  async function handleGetSubcategories() {
    axios.get(base_url + `subcategories`, {
      params: {
        limit: 3
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setDataSubCategoires(res.data)

      // setTopProduct(res.data)

    }).catch((err) => {
      setDataSubCategoires([])

    })
  }

  const scrollContainerRef = useRef();

  // Hàm cuộn về trái
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0, // Cuộn về chỉ mục 0
        behavior: 'smooth',
      });
    }
  };

  // Hàm cuộn về phải
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const currentScrollPosition = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const scrollWidth = scrollContainerRef.current.scrollWidth;

      const nextScrollPosition = Math.min(
        currentScrollPosition + containerWidth, // Cuộn thêm một màn hình
        scrollWidth - containerWidth // Không cuộn quá phần tử cuối
      );

      scrollContainerRef.current.scrollTo({
        left: nextScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <Container class1="home-wrapper-1 py-5">
        <div className="row">
          <div className="col-6">
            <div className="main-banner position-relative ">
              <img
                src="images/main-banner-1.jpg"
                className="img-fluid rounded-3"
                alt="main banner"
              />
              <div className="main-banner-content position-absolute">
                <h4>Build Confidence for Kids</h4>
                <h5>4 - 6 years old</h5>
                <p>Only $18.00</p>
                <Link to={'product'} className="button">BUY NOW</Link>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex flex-wrap gap-10 justify-content-between align-items-center">
              <div className="small-banner position-relative">
                <img
                  src="images/catbanner-01.jpg"
                  className="img-fluid rounded-3"
                  alt="main banner"
                />
                <div className="small-banner-content position-absolute">
                  <h4>Event</h4>
                  <h5>Deli Brand</h5>
                  <p>
                    Free <br />
                  </p>
                </div>
              </div>
              <div className="small-banner position-relative">
                <img
                  src="images/catbanner-02.jpg"
                  className="img-fluid rounded-3"
                  alt="main banner"
                />
                <div className="small-banner-content position-absolute">
                  <h4>NEW</h4>
                  <h5>Comics</h5>
                  <p>
                    From $9.00 <br />
                  </p>
                </div>
              </div>
              <div className="small-banner position-relative ">
                <img
                  src="images/catbanner-03.jpg"
                  className="img-fluid rounded-3"
                  alt="main banner"
                />
                <div className="small-banner-content position-absolute">
                  <h4>NEW ARRIVAL</h4>
                  <h5>Fairy Tails</h5>
                  <p>
                    From $99.00 <br />
                  </p>
                </div>
              </div>
              <div className="small-banner position-relative ">
                <img
                  src="images/catbanner-04.jpg"
                  className="img-fluid rounded-3"
                  alt="main banner"
                />
                <div className="small-banner-content position-absolute">
                  <h4>NEW ARRIVAL</h4>
                  <h5>Le Petit Prince</h5>
                  <p>
                    From $999.00 <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container class1="home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="servies d-flex align-items-center justify-content-between">
              {services?.map((i, j) => {
                return (
                  <div className="d-flex align-items-center gap-15" key={j}>
                    <img src={i.image} alt="services" />
                    <div>
                      <h6>{i.title}</h6>
                      <p className="mb-0">{i.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>

      <Container class1="featured-wrapper py-5 home-wrapper-2">
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
          Sản phẩm nổi bật
          <span style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "50px",
            height: "3px",
            background: "#e94560"
          }}></span>
        </h2>
        
        <div style={{ 
          background: "#fcdad8", 
          borderRadius: "10px",
          padding: "20px 10px", // Reduced padding from 25px 15px
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "row", 
            flexWrap: "wrap",
            justifyContent: "flex-start",
            margin: "0 -6px", // Reduced from -10px to match card padding
            gap: "0"
          }}>
            {topProduct.map((itemTop, indexTop) => (
              <ItemWishList 
                key={indexTop} 
                item={itemTop} 
                index={indexTop} 
                location={location} 
                grid={grid} 
                addToWish={addToWish} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</Container>
      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 'bold' }}>Danh sách sản phẩm</span>
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            {dataSubCategoires.map((itemSub) => {
              return (
                <div style={{ marginRight: 5, background: 'white', padding: 7, borderRadius: 10 }}>
                  <span>{itemSub.title}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ background: 'white', display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '0px 0px', borderRadius: 10, position: 'relative' }}>
          <div ref={scrollContainerRef} className="hidden-scroll-container" style={{ display: 'flex', flexDirection: 'row', gap: '5px', overflowX: 'auto', width: '100%', background: "#f5f5f7", zIndex: 1 }}>
            {topProduct.map((itemTop, indexTop) => {
              return (
                <ItemWishList key={indexTop} item={itemTop} index={indexTop} location={location} grid={grid} addToWish={addToWish} />
              )
            })}
          </div>

          <div onClick={handleScrollLeft} style={{ position: 'absolute', left: 10, background: '#fcdad8', borderRadius: 100, padding: 10, cursor: 'pointer', zIndex: 2 }}>
            <img src={left} style={{ width: 30, height: 30 }} />
          </div>
          <div onClick={handleScrollRight} style={{ position: 'absolute', right: 10, background: '#fcdad8', borderRadius: 100, padding: 10, cursor: 'pointer', zIndex: 2 }}>
            <img src={right} style={{ width: 30, height: 30 }} />
          </div>
        </div>
      </Container>

      <Container class1="famous-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div onClick={() => {
            navigate('/product')
            window.scrollTo({
              top: 0,
              behavior: 'smooth', // Hiệu ứng cuộn mượt mà
            });
          }} className="col-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-1.jpg"
                className="img-fluid"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5 className="text-dark">Calculators</h5>
                <h6 className="text-dark"> Casio FX-580 Scientific Calculator</h6>
                <p className="text-dark"> From $30.00</p>
              </div>
            </div>
          </div>
          <div onClick={() => {
            navigate('/product')
            window.scrollTo({
              top: 0,
              behavior: 'smooth', // Hiệu ứng cuộn mượt mà
            });
          }} className="col-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-2.jpg"
                className="img-fluid"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5 className="text-dark">Toys</h5>
                <h6 className="text-dark">Cute dolls for girls</h6>
                <p className="text-dark">From $10.00</p>
              </div>
            </div>
          </div>
          <div onClick={() => {
            navigate('/product')
            window.scrollTo({
              top: 0,
              behavior: 'smooth', // Hiệu ứng cuộn mượt mà
            });
          }} className="col-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-3.jpg"
                className="img-fluid"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5 className="text-dark">Highlighters</h5>
                <h6 className="text-dark">Stabilo Original Pastel</h6>
                <p className="text-dark">
                  Only $3.00
                </p>
              </div>
            </div>
          </div>
          <div onClick={() => {
            navigate('/product')
            window.scrollTo({
              top: 0,
              behavior: 'smooth', // Hiệu ứng cuộn mượt mà
            });
          }} className="col-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-4.jpg"
                className="img-fluid"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5 className="text-dark">Textbooks</h5>
                <h6 className="text-dark">Grade 1 - Grade 12</h6>
                <p className="text-dark">
                  From $30.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Special Products</h3>
          </div>
        </div>
        <div className="row">
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "special") {
                return (
                  <SpecialProduct
                    key={index}
                    id={item?._id}
                    brand={item?.brand}
                    title={item?.title}
                    totalrating={item?.totalrating.toString()}
                    price={item?.price}
                    sold={item?.sold}
                    quantity={item?.quantity}
                  />
                );
              }
            })}
        </div>
      </Container> */}
      
      <Container class1="marque-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="marquee-inner-wrapper card-wrapper">
              <Marquee className="d-flex">
                <div className="mx-4 w-25">
                  <img src="images/brand-01.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-02.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-03.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-04.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-05.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-06.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-07.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-08.png" alt="brand" />
                </div>
              </Marquee>
            </div>
          </div>
        </div>
      </Container>

      {/* <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Latest Blogs</h3>
          </div>
        </div>
        <div className="row">
          {blogState &&
            blogState?.map((item, index) => {
              if (index < 3) {
                return (
                  <div className="col-3 " key={index}>
                    <BlogCard
                      id={item?._id}
                      title={item?.title}
                      description={item?.description}
                      image={item?.images[0]?.url}
                      date={moment(item?.createdAt).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    />
                  </div>
                );
              }
            })}
        </div>
      </Container> */}
    </>
  );
};

export default Home;
