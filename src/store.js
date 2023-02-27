import { configureStore } from "@reduxjs/toolkit";
import RecipeListSlice from "./Component/RecipeList/RecipeListSlice";

const store = configureStore({
  reducer:{
    recipeList:RecipeListSlice,
  }
})

export default store