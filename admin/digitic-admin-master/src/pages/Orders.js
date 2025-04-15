import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getOrders } from "../features/auth/authSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, isError, error } = useSelector((state) => state.auth);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(getOrders()).then((res) => {
      console.log("Orders API Response:", res);
    });
  }, [dispatch]);

  // Debug orders state
  useEffect(() => {
    console.log("Orders State in Component:", orders);
  }, [orders]);

  // Prepare table data
  const dataSource = Array.isArray(orders) && orders.length
    ? orders.map((order, index) => ({
        key: index + 1,
        name: order?.user?.firstname
          ? `${order.user.firstname} ${order.user.lastname || ""}`
          : "N/A",
        product: (
          <Link to={`/admin/orders/${order?._id || ""}`}>
            View Orders
          </Link>
        ),
        amount: order?.totalPrice
          ? `$${order.totalPrice.toLocaleString()}`
          : "N/A",
        date: order?.createdAt
          ? new Date(order.createdAt).toLocaleString()
          : "N/A",
        action: (
          <>
            <Link to={`/admin/orders/${order?._id || ""}`} className="fs-3 text-danger">
              <BiEdit />
            </Link>
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => console.log("Delete order:", order._id)}
            >
              <AiFillDelete />
            </button>
          </>
        ),
      }))
    : [];

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      {isLoading && <p>Loading orders...</p>}
      {isError && <p className="text-danger">Error: {error || "Failed to load orders"}</p>}
      {!isLoading && !isError && (!Array.isArray(orders) || orders.length === 0) && (
        <p>No orders found.</p>
      )}
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          locale={{ emptyText: "No orders available" }}
        />
      </div>
    </div>
  );
};

export default Orders;