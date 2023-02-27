import { useRef } from 'react'
import { useSelector } from 'react-redux'
import './Form.css'

export const FormComponent =(props)=>{

  const ingredients = useSelector(state => state.recipeList.ingredients)
  const recipes= useSelector(state => state.recipeList.recipes)

  const preparationTimeRef = useRef()
  const cookingTimeRef = useRef()
  const instructionRef = useRef()
  const ingredientsRef = useRef()
  const titleRef = useRef()

  const typeOfModal = props.typeOfModalAdd
  let recipe = {}

  if(props.typeOfModalAdd !== "Add"){
    [recipe] = recipes.filter(recipe=> recipe.id === props.typeOfModalAdd)
  }

  const onSubmitFormHandler=(e)=>{
    e.preventDefault()
    
      let tmpIngredientsTab=[]
  
      for(let htmlelement of ingredientsRef.current.selectedOptions){
        tmpIngredientsTab.push(htmlelement.innerText)
      }
  
      const newRecipe = {
        title: titleRef.current.value,
        preparationTime: preparationTimeRef.current.value,
        cookingTime: cookingTimeRef.current.value,
        instruction: instructionRef.current.value,
        ingredients: tmpIngredientsTab
      }
    if(props.typeOfModalAdd === "Add"){
      props.AddRecipes(newRecipe)
    }
    else{
      newRecipe.id=recipe.id
      props.editRecipe(typeOfModal,newRecipe)
    }
  }

  const selectedOption=()=>{
    if(props.typeOfModalAdd !== "Add"){
      let tmpValue=[]
      recipe.ingredients.forEach(ingredient=>{
        ingredients.forEach(ingre=>{
          if(ingre.name === ingredient){
            tmpValue.push(ingre.id)
            return
          }
        })
      })
      return tmpValue
    }
    return []
  }

  return(
    <form className='formAddEdit' onSubmit={onSubmitFormHandler}>
      <div>
        <h2>{props.typeOfModalAdd === "Add"?"ajouter une recette":"Modifier une recettes"}</h2>
        <button type='button' className="fa-sharp fa-solid fa-xmark" onClick={()=>props.closeModal()}></button>
      </div>
      <label htmlFor="title">Nom de la recette :</label>
      <input className='inputFormAddEdit inputTmps' type="text" ref={titleRef} step={0.1} id="title" defaultValue={typeOfModal !== "Add" ? recipe.title:""}/>
      <label htmlFor="preparationTime">Temps de préparation (minutes):</label>
      <input className='inputFormAddEdit inputTmps' type="number" min={0} ref={preparationTimeRef} step={0.1} id="preparationTime" defaultValue={typeOfModal !== "Add" ? recipe.preparationTime:""}/>
      <label htmlFor="cookingTime">Temps de cuisons :</label>
      <input className='inputFormAddEdit inputTmps' type="number" min={0}  ref={cookingTimeRef} step={0.1} id="cookingTime" defaultValue={typeOfModal !== "Add" ? recipe.cookingTime:""}/>
      <label htmlFor="instruction">Instruction de préparation (minutess):</label>
      <textarea name="instruction" id="instruction" ref={instructionRef} cols="30" rows="8" defaultValue={typeOfModal !== "Add" ? recipe.instruction:""}></textarea>
      <label htmlFor="ingredients">Ingredients :</label>
      <select className='selectFormAddEdit' ref={ingredientsRef} name="ingredients" id="ingredients" multiple defaultValue={typeOfModal !== "Add" ? selectedOption():[]}>
        {
          ingredients && ingredients.map((ingredient) => <option value={ingredient.id} key={ingredient.id}>{ingredient.name}</option>)
        }
      </select>
      <button className="fa-solid fa-paper-plane"></button>
    </form>
  )
}
