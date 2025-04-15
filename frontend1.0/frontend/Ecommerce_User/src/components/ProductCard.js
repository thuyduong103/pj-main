import React from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import ItemWishList from "./ItemWishList";

// const ProductCard = (props) => {
//   const { grid, data } = props;
//   let location = useLocation();
//   const dispatch = useDispatch();

//   const addToWish = (id) => {
//     dispatch(addToWishlist(id));
//   };

//   return (
//     <>
//       {data?.map((item, index) => {
//         const imageUrl = item?.images?.[0]?.url || watch2; // fallback image if no image
//         const totalRating = item?.totalrating || 0; // fallback rating if undefined
//         const description = item?.description || "No description available"; // fallback description
//         const price = item?.price || 0; // fallback price if undefined
//         const brand = item?.brand || "Unknown Brand"; // fallback brand if undefined
//         const title = item?.title || "Untitled"; // fallback title if undefined

//         return (
//           <div
//             key={index}
//             className={` ${
//               location.pathname == "/product" ? `gr-${grid}` : "col-3"
//             } `}
//           >
//             <div
//               className="product-card position-relative"
//             >
//               <div className="wishlist-icon position-absolute">
//                 <button className="border-0 bg-transparent">
//                   <img
//                     onClick={() => addToWish(item?._id)}
//                     src={wish}
//                     alt="wishlist"
//                   />
//                 </button>
//               </div>
//               <div className="product-image">
//                 <img
//                   src={item?.images[0].url}
//                   className="img-fluid  mx-auto"
//                   alt="product image"
//                   width={160}
//                 />
//                 <img
//                   src={watch2}
//                   className="img-fluid  mx-auto"
//                   alt="product image"
//                   width={160}
//                 />
//               </div>
//               <div className="product-details">
//                 <h6 className="brand">{item?.brand}</h6>
//                 <h5 className="product-title">{item?.title}</h5>
//                 <ReactStars
//                   count={5}
//                   size={24}
//                   value={item?.totalrating.toString()}
//                   edit={false}
//                   activeColor="#ffd700"
//                 />
//                 <p
//                   className={`description ${
//                     grid === 12 ? "d-block" : "d-none"
//                   }`}
//                   dangerouslySetInnerHTML={{ __html: item?.description }}
//                 ></p>
//                 <p className="price">$ {item?.price}</p>
//               </div>
//               <div className="action-bar position-absolute">
//                 <div className="d-flex flex-column gap-15">
//                   {/* <button className="border-0 bg-transparent">
//                     <img src={prodcompare} alt="compare" />
//                   </button> */}
//                   <Link to={'/product/'+item?._id} className="border-0 bg-transparent">
//                     <img src={view} alt="view" />
//                   </Link>
//                  {/*  <button className="border-0 bg-transparent">
//                     <img src={addcart} alt="addcart" />
//                   </button> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// };

const ProductCard = (props) => {
  const { grid, data } = props;
  let location = useLocation();
  const dispatch = useDispatch();

  const addToWish = (id) => {
    dispatch(addToWishlist(id));
  };

  return (
    <>
      {data?.map((item, index) => {
        return (
          <ItemWishList item={item} index={index} location={location} grid={grid} addToWish={addToWish} />
        )
      })}
    </>
  );
};

export default ProductCard;
