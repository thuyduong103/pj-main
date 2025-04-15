import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const geSubCategories = async () => {
  const response = await axios.get(`${base_url}subcategories/`);

  return response.data;
};

const getDetailSubCategories = async (id) => {
  const response = await axios.get(`${base_url}subcategories/${id}`);

  return response.data;
};
const createSubCategory = async (category) => {
  const response = await axios.post(`${base_url}subcategories/`, category, config);

  return response.data;
};


const deleteSubProductCategory = async (id) => {
  const response = await axios.delete(`${base_url}subcategories/${id}`, config);

  return response.data;
};
const updateSubProductCategory = async (data) => {
  console.log(data);

  const response = await axios.put(
    `${base_url}subcategories/${data.id}`,
    {
      title: data.subCategories.title,
      categoryId: data.subCategories.categoryId
    },
    config
  );
  return response.data;
};
const pCategoryService = {
  geSubCategories,
  createSubCategory,
  deleteSubProductCategory,
  updateSubProductCategory,
  getDetailSubCategories
};

export default pCategoryService;
