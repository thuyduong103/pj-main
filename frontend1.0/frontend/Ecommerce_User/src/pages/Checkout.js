import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import watch from "../images/watch.jpg";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { base_url, base_url_image, config } from "../utils/axiosConfig";
import { createAnOrder } from "../features/user/userSlice";

const shippingSchema = yup.object({
  firstName: yup.string().required("First Name is Required"),
  lastName: yup.string().required("Last Name is Required"),
  address: yup.string().required("Address Details are Required"),
  state: yup.string().required("State is Required"),
  city: yup.string().required("City is Required"),
  country: yup.string().required("Country is Required"),
  pincode: yup.number().required("Pincode is Required"),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state.auth.cartProducts);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    razorpayPaymentId: "",
    razorpayOrderId: "",
  });
  const [cartProductState, setCartProductState] = useState([]);

  // Calculate total amount and prepare cart products
  useEffect(() => {
    if (!cartState || !Array.isArray(cartState)) {
      setTotalAmount(0);
      setCartProductState([]);
      return;
    }

    let sum = 0;
    const items = [];

    for (let index = 0; index < cartState.length; index++) {
      const item = cartState[index];
      if (
        item?.price &&
        item?.quantity &&
        !isNaN(item.price) &&
        !isNaN(item.quantity) &&
        item?.productId?._id
      ) {
        sum += Number(item.quantity) * Number(item.price);
        items.push({
          product: item.productId._id,
          quantity: item.quantity,
          color: item.color?._id || "",
          price: item.price,
        });
      }
    }

    setTotalAmount(sum);
    setCartProductState(items);
  }, [cartState]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      state: "",
      city: "",
      country: "",
      pincode: "",
      other: "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      setTimeout(() => {
        checkOutHandler(values);
      }, 300);
    },
  });

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const checkOutHandler = async (values) => {
    try {
      // Validate totalAmount before proceeding
      if (!totalAmount || totalAmount <= 0) {
        alert("Cart is empty or invalid. Please add items to proceed.");
        return;
      }

      // Check if amount exceeds limit (₹99,99,995 to account for +5 shipping)
      if (totalAmount > 100000000) {
        alert("Order amount exceeds maximum limit (₹99,99,995).");
        return;
      }

      // Uncomment for Razorpay payment integration
      // const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      // if (!res) {
      //   alert("Razorpay SDK failed to load");
      //   return;
      // }

      // Call backend to create order
      const result = await axios.post(
        `${base_url}user/order/checkout`,
        { amount: totalAmount + 5 },
        config
      );

      if (!result.data?.success) {
        alert(result.data.error || "Failed to create order");
        return;
      }

      const { amount, id: order_id, currency } = result.data.order;

      // Create order in Redux
      const resCreateOrder = await dispatch(
        createAnOrder({
          totalPrice: totalAmount,
          totalPriceAfterDiscount: amount,
          orderItems: cartProductState,
          paymentInfo,
          shippingInfo: values,
        })
      );

      if (resCreateOrder.payload?.status === 500) {
        alert("Failed to place order");
        return;
      }

      // Navigate to home on success
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (error) {
      console.error("Checkout Error:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred during checkout. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <Container class1="checkout-wrapper py-5 home-wrapper-2">
      <div className="row">
        <div className="col-7">
          <div className="checkout-left-data">
            <h3 className="website-name">Infinity</h3>
            <nav
              style={{ "--bs-breadcrumb-divider": ">" }}
              aria-label="breadcrumb"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="text-dark total-price" to="/cart">
                    Cart
                  </Link>
                </li>
                &nbsp;/&nbsp;
                <li
                  className="breadcrumb-item total-price active"
                  aria-current="page"
                >
                  Information
                </li>
                &nbsp;/&nbsp;
                <li className="breadcrumb-item total-price active">
                  Shipping
                </li>
                &nbsp;/&nbsp;
                <li
                  className="breadcrumb-item total-price active"
                  aria-current="page"
                >
                  Payment
                </li>
              </ol>
            </nav>
            <h4 className="title total">Contact Information</h4>
            <p className="user-details total">
              Sristy Verma (dreamlicious.srs@gmail.com)
            </p>
            <h4 className="mb-3">Shipping Address</h4>
            <form
              onSubmit={formik.handleSubmit}
              className="d-flex gap-15 flex-wrap justify-content-between"
            >
              <div className="w-100">
                <select
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange("country")}
                  onBlur={formik.handleBlur("country")}
                  className="form-control form-select"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  <option value="India">India</option>
                </select>
                {formik.touched.country && formik.errors.country && (
                  <div className="error ms-2 my-1">{formik.errors.country}</div>
                )}
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="First Name"
                  className="form-control"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange("firstName")}
                  onBlur={formik.handleBlur("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="error ms-2 my-1">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="form-control"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange("lastName")}
                  onBlur={formik.handleBlur("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="error ms-2 my-1">{formik.errors.lastName}</div>
                )}
              </div>
              <div className="w-100">
                <input
                  type="text"
                  placeholder="Address"
                  className="form-control"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange("address")}
                  onBlur={formik.handleBlur("address")}
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="error ms-2 my-1">{formik.errors.address}</div>
                )}
              </div>
              <div className="w-100">
                <input
                  type="text"
                  placeholder="Apartment, Suite, etc (optional)"
                  className="form-control"
                  name="other"
                  value={formik.values.other}
                  onChange={formik.handleChange("other")}
                  onBlur={formik.handleBlur("other")}
                />
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="City"
                  className="form-control"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange("city")}
                  onBlur={formik.handleBlur("city")}
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="error ms-2 my-1">{formik.errors.city}</div>
                )}
              </div>
              <div className="flex-grow-1">
                <select
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange("state")}
                  onBlur={formik.handleBlur("state")}
                  className="form-control form-select"
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  <option value="Deoria">Deoria</option>
                </select>
                {formik.touched.state && formik.errors.state && (
                  <div className="error ms-2 my-1">{formik.errors.state}</div>
                )}
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="Zipcode"
                  className="form-control"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange("pincode")}
                  onBlur={formik.handleBlur("pincode")}
                />
                {formik.touched.pincode && formik.errors.pincode && (
                  <div className="error ms-2 my-1">{formik.errors.pincode}</div>
                )}
              </div>
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/cart" className="text-dark">
                    <BiArrowBack className="me-2" />
                    Return to Cart
                  </Link>
                  <button
                    className="button"
                    type="submit"
                    disabled={
                      !totalAmount ||
                      totalAmount <= 0 ||
                      totalAmount > 9999995
                    }
                  >
                    {!totalAmount || totalAmount <= 0
                      ? "Cart Empty"
                      : totalAmount > 9999995
                      ? "Amount Too High"
                      : "Place Order"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-5">
          <div className="border-bottom py-4">
            {cartState && cartState.length > 0 ? (
              cartState.map((item, index) => {
                const img = item?.productId?.images
                  ? `${base_url_image}${item?.productId?.images}`
                  : watch;
                return (
                  <div
                    key={index}
                    className="d-flex gap-10 mb-2 align-items-center"
                  >
                    <div className="w-75 d-flex gap-10">
                      <div className="w-25 position-relative">
                        <span
                          style={{ top: "-10px", right: "2px" }}
                          className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                        >
                          {item?.quantity || 0}
                        </span>
                        <img
                          width={100}
                          height={100}
                          src={img}
                          alt="product"
                          onError={(e) => (e.target.src = watch)}
                        />
                      </div>
                      <div>
                        <h5 className="total-price">
                          {item?.productId?.title || "Unknown Product"}
                        </h5>
                        <p className="total-price">
                          {item?.color?.title || "No Color"}
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="total">
                        ${" "}
                        {(item?.price && item?.quantity
                          ? item.price * item.quantity
                          : 0
                        ).toLocaleString()}
                      </h5>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="total">Your cart is empty.</p>
            )}
          </div>
          <div className="border-bottom py-4">
            <div className="d-flex justify-content-between align-items-center">
              <p className="total">Subtotal</p>
              <p className="total-price">
                $ {totalAmount ? totalAmount.toLocaleString() : "0"}
              </p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 total">Shipping</p>
              <p className="mb-0 total-price">$ 5</p>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center border-bottom py-4">
            <h4 className="total">Total</h4>
            <h5 className="total-price">
              $ {totalAmount ? (totalAmount + 5).toLocaleString() : "0"}
            </h5>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Checkout;