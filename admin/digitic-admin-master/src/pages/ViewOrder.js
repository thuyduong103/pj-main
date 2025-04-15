 import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Card, Descriptions, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { getOrderByUser } from "../features/auth/authSlice";
import authService from "../features/auth/authServices";

const ViewOrder = () => {
 const location = useLocation();
 const orderId = location.pathname.split("/")  [3];
 const dispatch = useDispatch();
 const { orderbyuser, isLoading, isError, message } = useSelector((state) => state.auth);

 // State to store product details
 const [productDetails, setProductDetails] = useState({});

 useEffect(() => {
 if (orderId) {
 dispatch(getOrderByUser(orderId));
 }
 }, [orderId, dispatch]);

 // Fetch product details for each order item
 useEffect(() => {
 const fetchProductDetails = async () => {
 if (orderbyuser?.orderItems && Array.isArray(orderbyuser.orderItems)) {
 const productPromises = orderbyuser.orderItems.map(async (item) => {
 try {
 const product = await authService.getProduct(item.product);
 return { id: item.product, title: product.title || `Product ID: ${item.product}` };
 } catch (error) {
 console.error(`Failed to fetch product ${item.product}:`, error);
 return { id: item.product, title: `Product ID: ${item.product}` };
 }
 });
 const products = await Promise.all(productPromises);
 const productMap = products.reduce((acc, { id, title }) => {
 acc[id] = title;
 return acc;
 }, {});
 setProductDetails(productMap);
 }
 };
 fetchProductDetails();
 }, [orderbyuser]);

 useEffect(() => {
 console.log("Order data:", orderbyuser);
 console.log("Product Details:", productDetails);
 }, [orderbyuser, productDetails]);

 const columns = [
 { title: "SNo", dataIndex: "key" },
 { title: "Product Name", dataIndex: "name" },
 { title: "Quantity", dataIndex: "quantity" },
 {
 title: "Price",
 dataIndex: "price",
 render: (price) => `$${price?.toLocaleString() || "0"}`,
 },
 {
 title: "Total",
 dataIndex: "total",
 render: (total) => `$${total?.toLocaleString() || "0"}`,
 },
 { title: "Action", dataIndex: "action" },
 ];

 if (isLoading) {
 return (
 <div className="d-flex justify-content-center my-5">
 <Spin size="large" tip="Loading order details..." />
 </div>
 );
 }

 if (isError) {
 return (
 <Alert
 message="Error"
 description={message || "Failed to load order details"}
 type="error"
 showIcon
 />
 );
 }

 if (!orderbyuser && !isLoading) {
 return (
 <Alert
 message="Order Not Found"
 description="The requested order could not be found"
 type="warning"
 showIcon
 />
 );
 }

 const data = [];
 if (orderbyuser?.orderItems && Array.isArray(orderbyuser.orderItems)) {
 console.log("Order Items:", orderbyuser.orderItems);
 orderbyuser.orderItems.forEach((item, index) => {
 console.log("Processing Item:", item);
 data.push({
 key: index + 1,
 name: productDetails[item.product] || `Product ID: ${item.product}` || "Product not available",
 quantity: item.quantity,
 price: item.price,
 total: item.price * item.quantity,
 action: (
 <>
 <Link to="/" className="fs-3 text-danger">
 <BiEdit />
 </Link>
 <Link className="ms-3 fs-3 text-danger" to="/">
 <AiFillDelete />
 </Link>
 </>
 ),
 });
 });
 } else {
 console.log("No order items or invalid format:", orderbyuser?.orderItems);
 }

 const getStatusColor = (status) => {
 switch (status) {
 case "Ordered":
 return "blue";
 case "Processing":
 return "orange";
 case "Shipped":
 return "cyan";
 case "Delivered":
 return "green";
 case "Cancelled":
 return "red";
 default:
 return "default";
 }
 };

 return (
 <div className="container-xxl">
 <h3 className="mb-4 title">View Order</h3>

 <Card className="mb-4">
 <Descriptions title="Order Information" bordered>
 <Descriptions.Item label="Order ID" span={3}>
 {orderbyuser._id}
 </Descriptions.Item>
 <Descriptions.Item label="Customer Name" span={2}>
 {orderbyuser.user?.firstname} {orderbyuser.user?.lastname}
 </Descriptions.Item>
 <Descriptions.Item label="Order Status">
 <Tag color={getStatusColor(orderbyuser.orderStaus)}>
 {orderbyuser.orderStaus}
 </Tag>
 </Descriptions.Item>
 <Descriptions.Item label="Order Date" span={3}>
 {new Date(orderbyuser.createdAt).toLocaleString()}
 </Descriptions.Item>
 <Descriptions.Item label="Payment Date" span={3}>
 {orderbyuser.paidAt
 ? new Date(orderbyuser.paidAt).toLocaleString()
 : "N/A"}
 </Descriptions.Item>
 <Descriptions.Item label="Month" span={3}>
 {orderbyuser.month}
 </Descriptions.Item>
 </Descriptions>
 </Card>

 <Card className="mb-4">
 <Descriptions title="Shipping Information" bordered>
 <Descriptions.Item label="Name" span={3}>
 {orderbyuser.shippingInfo?.firstName} {orderbyuser.shippingInfo?.lastName}
 </Descriptions.Item>
 <Descriptions.Item label="Address" span={3}>
 {orderbyuser.shippingInfo?.address}
 </Descriptions.Item>
 <Descriptions.Item label="City">
 {orderbyuser.shippingInfo?.city}
 </Descriptions.Item>
 <Descriptions.Item label="State">
 {orderbyuser.shippingInfo?.state}
 </Descriptions.Item>
 <Descriptions.Item label="Pincode">
 {orderbyuser.shippingInfo?.pincode}
 </Descriptions.Item>
 <Descriptions.Item label="Additional Information" span={3}>
 {orderbyuser.shippingInfo?.other || "N/A"}
 </Descriptions.Item>
 </Descriptions>
 </Card>

 <Card className="mb-4">
 <h4>Order Items</h4>
 <Table columns={columns} dataSource={data} pagination={false} />

 <div className="d-flex justify-content-end mt-4">
 <div style={{ width: "300px" }}>
 <Descriptions bordered column={1}>
 <Descriptions.Item label="Subtotal">
 ${orderbyuser.totalPrice?.toLocaleString() || "0"}
 </Descriptions.Item>
 {orderbyuser.totalPrice !== orderbyuser.totalPriceAfterDiscount && (
 <Descriptions.Item label="Discount">
 -$
 {(orderbyuser.totalPrice - orderbyuser.totalPriceAfterDiscount).toLocaleString()}
 </Descriptions.Item>
 )}
 <Descriptions.Item label="Total">
 <strong>
 ${orderbyuser.totalPriceAfterDiscount?.toLocaleString() || "0"}
 </strong>
 </Descriptions.Item>
 </Descriptions>
 </div>
 </div>
 </Card>
 </div>
 );
};

export default ViewOrder;