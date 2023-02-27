import { createSlice } from "@reduxjs/toolkit";


const RecipeListSclice = createSlice({
  name:"RecipeList",
  initialState:{
    recipes:[],
    ingredients:[],
    isLogged:false
  },
  reducers:{
    setIsLoggedAction(state, actions){
      state.isLogged= actions.payload
    },
    setIngredientsAction(state,actions){
      state.ingredients=[]
      actions.payload.forEach((ingredients,index)=>state.ingredients.push({id:index,name:ingredients}))
    },
    addRecipeAction(state,actions){
      state.recipes.push(actions.payload)
      state.recipes = state.recipes.sort((a,b)=>a.title.localeCompare(b.title) )
    },
    setRecipesAction(state,actions){
      state.recipes=[]
      actions.payload.forEach(recipe => {
        state.recipes.push(recipe)
      });
      state.recipes = state.recipes.sort((a,b)=>a.title.localeCompare(b.title) )
    },
    editRecipesList(state,actions){
      state.recipes=[]
      state.recipes=actions.payload
      state.recipes = state.recipes.sort((a,b)=>a.title.localeCompare(b.title) )
    },
    suprRecipesList(state,actions){
      state.recipes=actions.payload
      state.recipes = state.recipes.sort((a,b)=>a.title.localeCompare(b.title) )
    }

  }
})

export const { suprRecipesList, setIsLoggedAction, setIngredientsAction, addRecipeAction, setRecipesAction, editRecipesList} = RecipeListSclice.actions

export default RecipeListSclice.reducer