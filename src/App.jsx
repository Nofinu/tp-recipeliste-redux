import './App.css';
import {useEffect, useRef, useState} from 'react'
import {createPortal} from "react-dom"
import { ModalComponent } from './Component/Shared/ModalComponent';
import {API_KEY} from "./API_KEY.js"
import { RecipeContainerComponent } from './Component/RecipeContainer/RecipeContainerComponent';
import { useDispatch, useSelector } from 'react-redux';
import { suprRecipesList, setRecipesAction, addRecipeAction, setIngredientsAction, setIsLoggedAction, editRecipesList } from './Component/RecipeList/RecipeListSlice';
import { FormComponent } from './Component/FormComponent/FormComponent';

function App() {

  const dispatch = useDispatch()
  const URL_DB="https://listerecette-redux-default-rtdb.europe-west1.firebasedatabase.app/"

  const isLogged = useSelector(state => state.recipeList.isLogged)
  const recipes = useSelector(state =>state.recipeList.recipes)

  const [isLoggin,setIsLoggin]=useState(false)
  const [modalLoginStatus,setModalLoginStatus]=useState(false)
  const [modalAddStatus,setModalAddStatus]=useState(false)
  const [typeOfModalAdd,setTypeOfModalAdd]=useState("")

  const passwordRef = useRef()
  const emailRef = useRef()
  const buttonref = useRef()


  // const initingredient= async()=>{
  //   try{
  //     const token = localStorage.getItem('token')
  //     const URL_DB="https://listerecette-redux-default-rtdb.europe-west1.firebasedatabase.app/"
  //     if(token){
  //       const reponse = await fetch(`${URL_DB}ingredients.json?auth=${token}`,{
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body : JSON.stringify({"0":"eggs","1":"flour","2":"butter","3":"tomato","4":"corn","5":"sugar","6":"salt"})
  //       })

  //       const data = await reponse.json()
  //       console.log(data)

  //     }
  //   }
  //   catch(error){
  //     console.error(error.message);
  //   }
  // }

  const refreshIngredients= async()=>{
    try{
      const reponse = await fetch(`${URL_DB}ingredients.json`)
  
      if(!reponse.ok){
        throw new Error('Un probleme est survenu lors de la recuperation de la liste des ingredients')
      }
  
      const data = await reponse.json()
  
      let tmpIngredients=[]
      for(let key in data){
        data[key].forEach(element => {
          tmpIngredients.push(element)
        });
      }
      dispatch(setIngredientsAction(tmpIngredients))
    }

    catch(error){
      console.error(error.message);
    }
  }


const onSubmitFormInputHandler= async (e)=>{
  e.preventDefault()
  let BASE_URL = ""
  if (isLoggin){
    BASE_URL=`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
  }
  else{
    BASE_URL=`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`
  }
  try{
    const response = await fetch(BASE_URL,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        returnSecureToken : true
      })
    })

    if(!response.ok){
      throw new Error(`il a eu une erreure lors ${isLoggin? "du Log In" : "de l'enregistrement"}`)
    }

    const data = await response.json()

    localStorage.setItem('token',data.idToken)

    emailRef.current.value=""
    passwordRef.current.value=""

    dispatch(setIsLoggedAction(true))
    setModalLoginStatus(false)
  }
  catch(error){
    console.error(error.message);
  }
}

const AddRecipes = async(recipe)=>{
  try{
    const token = localStorage.getItem('token')
    if(token){
      const response = await fetch(`${URL_DB}recipes.json?auth=${token}`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body : JSON.stringify(recipe)
        })
      if(!response.ok){
        throw new Error(`il y a eu un probleme lors de l'ajout de ${recipe}`)
      }
      const data = await response.json()
      const recipeAdd = {id:data.name,...recipe}
      dispatch(addRecipeAction(recipeAdd))
      closeModal()
    }
  }
  catch(error){
    console.error(error.message);
  }
}

const editRecipe = async (id,recipeEdit)=>{
  const recipeCible = recipes.find(recipe=>recipe.id === id)
  if(recipeCible){
    const token = localStorage.getItem('token')
    if(token){
      try{
        const response = await fetch(`${URL_DB}recipes/${id}.json?auth=${token}`,{
          method:"PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(recipeEdit)
        })
        if(!response.ok){
          throw new Error(`il a eu une erreure lors de la modifictaion de ${id}` )
        }
        const tmpRecipes = [...recipes.filter(recipe => recipe!==recipeCible),recipeEdit]
        dispatch(editRecipesList(tmpRecipes))
        closeModal()
      }
      catch(error){
        console.error(error.message);
      } 
    }
  }
}

const suprRecipe= async (id)=>{
  if(window.confirm("etes vous sur de vouloir suprimer la recette ?")){
    const recipeCible = recipes.find(recipe=>recipe.id === id)
    if(recipeCible){
      try{
        const token =localStorage.getItem('token')
        if(token){
          const reponse = await fetch(`${URL_DB}recipes/${id}.json?auth=${token}`,{
            method:"DELETE"
          })
          if(!reponse.ok){
            throw new Error('il y a eu une erreure lors de la supression de la recette')
          }
        }
        const tmpRecipes = [...recipes.filter(recipe => recipe!==recipeCible)]
        dispatch(suprRecipesList(tmpRecipes))
        closeModal()
      }
      catch(error){
        console.error(error.message);
      }
    }
  }
}

const refreshRecipes=async()=>{
  try{
    const reponse = await fetch(`${URL_DB}recipes.json`)

    if(!reponse.ok){
      throw new Error('Un probleme est survenu lors de la recuperation de la liste des ingredients')
    }

    const data = await reponse.json()

    let tmpRecipes=[]
    for(let key in data){
      tmpRecipes.push({id:key,...data[key]})
      };
    dispatch(setRecipesAction(tmpRecipes))
    }
    catch(error){
      console.error(error.message);
    }
  }
  



const openModalAddHandler=(type)=>{
  setModalAddStatus(true)
  setTypeOfModalAdd(type)
}

  const modalLoginHandler=(entry="")=>{
    if(entry === "login"){
      setIsLoggin(true)
    }
    else{
      setIsLoggin(false)
    }
    setModalLoginStatus(true)
  }

  const closeModal=()=>{
    setModalLoginStatus(false)
    setModalAddStatus(false)
  }

  const LogOutHandler =()=>{
    dispatch(setIsLoggedAction(false))
    localStorage.setItem('token',"")
  }


  useEffect(()=>{
    refreshIngredients()
    refreshRecipes()
  },[])

  return (
    <>
      {
        modalLoginStatus && createPortal(<ModalComponent closeModal={closeModal}>
            <form className='FormInput' onSubmit={onSubmitFormInputHandler}>
              <div className='formInputHeader'>
                <h2>{isLoggin? "Log In" : "Register"}</h2>
                <button type='button' className="fa-sharp fa-solid fa-xmark" onClick={closeModal}></button>
              </div>
              <hr />
              <label htmlFor="inputEmail">Email :</label>
              <input type="text" id="inputEmail" ref={emailRef}/>
              <label htmlFor="inputPassword">Password :</label>
              <input type="password" id="inputPassword" ref={passwordRef} />
              <div className='divButton'>
                <button ref={buttonref}>{isLoggin? "Log In" : "Register"}</button>
              </div>
            </form>
            
          </ModalComponent>,document.getElementById('modal-root'))
      }
      {
        modalAddStatus && createPortal(<ModalComponent closeModal={closeModal}>
          <FormComponent typeOfModalAdd={typeOfModalAdd} editRecipe={editRecipe} AddRecipes={AddRecipes} closeModal={closeModal}/>
        </ModalComponent>,document.getElementById('modal-root'))
      }
      <div className="App">
        <header className="App-header">
          <nav className='navbar'>
            <h1 className="title"><i className='fa-solid fa-fire '></i> eRecipe</h1>
            <div>
              {
                isLogged? <button onClick={LogOutHandler}>Log out</button>
                :
                <>
                  <button onClick={()=>modalLoginHandler("login")}>Log In</button>
                  <button onClick={modalLoginHandler}>Register</button>
                </>
              }
            </div>
          </nav>
        </header>
          <RecipeContainerComponent suprRecipe={suprRecipe} openModalAddHandler={openModalAddHandler}/>
      </div>
    </>
  );
}

export default App;
