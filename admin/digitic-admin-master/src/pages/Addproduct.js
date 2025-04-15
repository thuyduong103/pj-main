import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, getProductsById, resetState, updateProducts } from "../features/product/productSlice";
import { getSubCategories } from "../features/subpcategory/subpcategorySlice";
let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  subcategory: yup.string().required("subcategory is Required"),
  quantity: yup.number().required("Quantity is Required"),
  images: yup.string().required("Vui lòng chọn ảnh"),
  brand: yup.string().required("Brand is Required"),
});

const Addproduct = () => {

  const location = useLocation();
  const getIdProduct = location.pathname.split("/")[3];


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);

  const subPCategories = useSelector((state) => state.subcategories.subPCategories);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const brandState = useSelector((state) => state.brand.brands);
  const imgState = useSelector((state) => state.upload.images);
  const { newProduct } = useSelector((state) => state.product);

  useEffect(() => {
    // dispatch(getCategories());
    dispatch(getBrands());
    dispatch(getSubCategories());
  }, []);

  useEffect(() => {

    if (getIdProduct !== undefined) {
      dispatch(getProductsById(getIdProduct))
    } else {
      dispatch(resetState());
    }

  }, [getIdProduct])




  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success("Product Added Successfullly!");
  //   }
  //   if (isError) {
  //     toast.error("Something Went Wrong!");
  //   }
  // }, [isSuccess, isError, isLoading]);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: newProduct?.title || "",
      description: newProduct?.description || "",
      price: newProduct?.price || "",
      subcategory: newProduct?.subcategory?._id || null,
      quantity: newProduct?.quantity || '',
      images: newProduct?.images || '',
      brand: newProduct?.brand?._id || null
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getIdProduct !== undefined) {
        dispatch(updateProducts({
          id: newProduct._id,
          data: values
        }));
        toast.success("Product Added Successfullly!");
        formik.resetForm();
        setTimeout(() => {
          navigate('/admin/list-product')
          dispatch(resetState());
        }, 3000);
      } else {
        dispatch(createProducts(values));
        formik.resetForm();
        toast.success("Product Added Successfullly!");
        setTimeout(() => {
          dispatch(resetState());
        }, 3000);
      }

    },
  });
  const handleColors = (e) => {
    setColor(e);
    console.log(color);
  };
  return (
    <div>
      <h3 className="mb-4 title">{!getIdProduct ? "Add Product" : "Update Product"}</h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i._id}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name="subcategory"
            onChange={formik.handleChange("subcategory")}
            onBlur={formik.handleBlur("subcategory")}
            value={formik.values.subcategory}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select SubCategory</option>
            {subPCategories.map((i, j) => {
              return (
                <option key={j} value={i._id}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.subcategory && formik.errors.subcategory}
          </div>

          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          {!newProduct && <div className="bg-white border-1 p-5 text-center">
            <Dropzone
              onDrop={async (acceptedFiles) => {
                let res = await dispatch(uploadImg(acceptedFiles))
                if (res?.payload?.data?.filename) {
                  formik.setFieldValue("images", res?.payload?.data?.filename)
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>}
          <div className="error">
            {formik.touched.images && formik.errors.images}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {!getIdProduct ? "Add Product" : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
