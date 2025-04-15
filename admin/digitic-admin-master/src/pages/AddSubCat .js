import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createCategory,
  createSubCategory,
  getAProductCategory,
  getIdSubCategories,
  resetState,
  updateASubCategory,
} from "../features/subpcategory/subpcategorySlice";
import { getCategories } from "../features/bcategory/bcategorySlice";
let schema = yup.object().shape({
  title: yup.string().required("Category Name is Required"),
});
const AddSubcat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];
  console.log(getPCatId);

  const navigate = useNavigate();

  const [pCatStat, setPCatStat] = useState([])

  const { newSubcategories } = useSelector((state) => state.subcategories);

  useEffect(() => {
    handleGetPCat()
  }, [])

  useEffect(() => {
    if (getPCatId !== undefined) {
      dispatch(getIdSubCategories(getPCatId));
    } else {
      dispatch(resetState());
    }
  }, [getPCatId]);

  async function handleGetPCat() {
    let res = await dispatch(getCategories());
    if (res.payload) {
      setPCatStat(res.payload)
    }
  }


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: newSubcategories?.title || '',
      categoryId: newSubcategories?.categoryId?._id || '', // Giá trị cho category
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) {
        errors.title = "Title is required";
      }
      if (!values.categoryId) {
        errors.categoryId = "Category is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log("Form submitted:", values); // Xử lý submit tại đây
      if (getPCatId !== undefined) {
        const data = { id: newSubcategories._id, subCategories: values };
        dispatch(updateASubCategory(data));
        toast.success("Category Updated Successfullly!");
        setTimeout(() => {
          navigate("/admin/list-subcategory");
        }, 300)
      } else {
        dispatch(createSubCategory(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
        toast.success("Category Added Successfullly!");
        // Gọi API để thêm mới

      }
    },
  });

  return (
    <div>
      <h3 className="mb-4  title">
        {getPCatId !== undefined ? "Edit" : "Add"} SubCategory
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Enter SubCategory"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            id="brand"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <select
            id="category-select"
            className="form-select mt-3 py-3"
            value={formik.values.categoryId}
            onChange={formik.handleChange("categoryId")}
            onBlur={formik.handleBlur("categoryId")}
          >
            <option value="" disabled>
              Choose a Category
            </option>
            {pCatStat.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
          <div className="error">
            {formik.touched.categoryId && formik.errors.categoryId}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getPCatId !== undefined ? "Edit" : "Add"} SubCategory
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubcat;
