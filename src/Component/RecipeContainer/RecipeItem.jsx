import { useSelector } from "react-redux"

export const RecipeItem =(props)=>{

  const [recipeItem] = useSelector(state => state.recipeList.recipes).filter(recipe=> recipe.id === props.id)
  const isLogged = useSelector(state => state.recipeList.isLogged)

  return(
    <div className="RecipeItem">
      <div className="RecipeItemHeader">
        <h2>{recipeItem.title}</h2>
        <div>
          <div><p className="fa-solid fa-clock"> {recipeItem.preparationTime}</p> mins</div>
          <div><p className="fa-solid fa-fire"> {recipeItem.cookingTime}</p> mins</div>
        </div>
      </div>
      <hr />
      <div className="RecipeItemBody">
        <div>
          <p>{recipeItem.instruction}</p>
          <ul>
            {
              recipeItem.ingredients.map((ingredient,index)=><li key={index}>{ingredient}</li>)
            }
          </ul>
        </div>
        {
        isLogged &&
        <div className="RecipeItemButtonDiv">
          <button className="fa-sharp fa-solid fa-pen-to-square" onClick={()=>props.openModalAddHandler(recipeItem.id)}> Edit</button>
          <button className="fa-solid fa-trash" onClick={()=>props.suprRecipe(recipeItem.id)}> Supr</button>
        </div>
        }
      </div>
    </div>
  )
}