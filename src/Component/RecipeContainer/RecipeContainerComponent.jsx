import { useSelector } from 'react-redux'
import './RecipeContainer.css'
import { RecipeItem } from './RecipeItem'

export const RecipeContainerComponent=(props)=>{

  const isLogged = useSelector(state => state.recipeList.isLogged)
  const recipes = useSelector(state => state.recipeList.recipes)

  return(
      <div className="recipeContainer">
        <div className="headerRecipeContainer">
          <h2>Recipe List</h2>
          {isLogged &&<button className='fa-sharp fa-solid fa-plus' onClick={()=>props.openModalAddHandler("Add")}>Add</button>}
        </div>
        <hr />
        <div>
          {
            recipes.length !==0 && recipes.map(recipe =><RecipeItem suprRecipe={props.suprRecipe} openModalAddHandler={props.openModalAddHandler} key={recipe.id} id={recipe.id}/>)
          }
        </div>
      </div>
  )
} 