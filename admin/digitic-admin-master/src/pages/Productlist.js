import React, { useEffect } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts } from "../features/product/productSlice";
import { Link } from "react-router-dom";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Brand",
    dataIndex: ["brand", "title"],
  },
  {
    title: "SubCategory",
    dataIndex: ["subcategory", "title"],
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, []);
  const productState = useSelector((state) => state.product.products);
  const data1 = [];

  for (let i = 0; i < productState.length; i++) {
    data1.push({
      key: i + 1,
      title: productState[i].title,
      brand: productState[i].brand,
      subcategory: productState[i].subcategory,
      color: productState[i].color,
      price: `${productState[i].price}`,
      action: (
        <>
          <Link to={`/admin/product/${productState[i]._id}`} className=" fs-3 text-danger">
            <BiEdit />
          </Link>
          <button style={{ border: 'none', background: 'white' }} onClick={() => handleDeleteProduct(productState[i]._id)} className="ms-3 fs-3 text-danger" to="/">
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }

  async function handleDeleteProduct(id) {
    let res = await dispatch(deleteProduct(id))
    if (res.payload) {
      dispatch(getProducts());
    }
  }

  console.log(data1);
  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Productlist;
