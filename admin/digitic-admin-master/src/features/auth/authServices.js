import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const login = async (user) => {
  const response = await axios.post(`${base_url}user/admin-login`, user);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const getOrders = async () => {
  try {
    const response = await axios.get(`${base_url}user/getallorders`, config);
    console.log("Raw API Response (getOrders):", response.data);
    return response.data.orders || [];
  } catch (error) {
    console.error("Get Orders Error:", error);
    throw error;
  }
};

const getOrder = async (id) => {
  try {
    const response = await axios.post(`${base_url}user/getorderbyuser/${id}`, "", config);
    console.log("getOrderByUser Response:", response.data);
    const order = response.data.orders?.find((o) => o._id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    console.log("Filtered Order:", order);
    return order;
  } catch (error) {
    console.error("Get Order Error:", error);
    throw error;
  }
};

const getProduct = async (id) => {
  try {
    const response = await axios.get(`${base_url}product/${id}`, config);
    console.log("getProduct Response:", response.data);
    return response.data; // Expect { _id, title, ... }
  } catch (error) {
    console.error("Get Product Error:", error);
    throw error;
  }
};

const authService = {
  login,
  getOrders,
  getOrder,
  getProduct,
};

export default authService;