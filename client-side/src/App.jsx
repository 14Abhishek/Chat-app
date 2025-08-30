import { Routes, Route } from "react-router-dom"
import {LoginPage} from "./pages/LoginPage.jsx"
import {ProfilePage} from "./pages/ProfilePage.jsx"
import HomePage from "./pages/HomePage.jsx"
import {Toaster} from "react-hot-toast"

function App() {  
  return (
    <div className = "bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>  
        <Route path = '/' element = {<HomePage/>} />
        <Route path = '/login' element = {<LoginPage/>} />
        <Route path = '/profile' element = {<ProfilePage/>} />
      </Routes>
    </div>
  )
}

export default App
