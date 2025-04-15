import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import subCategories from "./subpcategoryService";

export const getSubCategories = createAsyncThunk(
  "productSubCategory/get-sub-categories",
  async (thunkAPI) => {
    try {
      return await subCategories.geSubCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getIdSubCategories = createAsyncThunk(
  "productSubCategory/get-id-sub-categories",
  async (id, thunkAPI) => {
    try {
      return await subCategories.getDetailSubCategories(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createSubCategory = createAsyncThunk(
  "productSubCategory/create-sub-category",
  async (categoryData, thunkAPI) => {
    try {
      return await subCategories.createSubCategory(categoryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateASubCategory = createAsyncThunk(
  "productSubCategory/update-sub-category",
  async (category, thunkAPI) => {
    try {
      return await subCategories.updateSubProductCategory(category);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteASubCategory = createAsyncThunk(
  "productSubCategory/delete-sub-category",
  async (id, thunkAPI) => {
    try {
      return await subCategories.deleteSubProductCategory(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const resetState = createAction("RevertAll");

const initialState = {
  subPCategories: [],
  newSubcategories: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const subPCategorySlice = createSlice({
  name: "subPCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.subPCategories = action.payload;
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdCategory = action.payload;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateASubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateASubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedCategory = action.payload;
      })
      .addCase(updateASubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteASubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteASubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedCategory = action.payload;
      })
      .addCase(deleteASubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getIdSubCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIdSubCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.newSubcategories = action.payload
      })
      .addCase(getIdSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default subPCategorySlice.reducer;
