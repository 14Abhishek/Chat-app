import { Routes, Route, Navigate } from "react-router-dom"
import {LoginPage} from "./pages/LoginPage.jsx"
import {ProfilePage} from "./pages/ProfilePage.jsx"
import HomePage from "./pages/HomePage.jsx"
import {Toaster} from "react-hot-toast"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext.jsx"

function App() {  
  const {authUser} = useContext(AuthContext)
  return (
    <div className = "bg-[url('./src/assets/bgImage.svg')] bg-contain">
      {/* when a user is loggedin he can only access the homePage and profilePage, but if he is not logged in he can only access LoginPage */}
      <Toaster/>
      <Routes>  
        <Route path = '/' element = {authUser? <HomePage/> : <Navigate to="/login" />} />
        <Route path = '/login' element = {!authUser? <LoginPage/>: <Navigate to="/" />} />
        <Route path = '/profile' element = {authUser? <ProfilePage/> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
