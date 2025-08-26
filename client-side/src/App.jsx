import { Routes, Route } from "react-router-dom"
import {LoginPage} from "./pages/LoginPage.jsx"
import {ProfilePage} from "./pages/ProfilePage.jsx"
import HomePage from "./pages/HomePage.jsx"

function App() {

  
  return (
    <div className = "bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Routes>  
        <Route path = '/' element = {<HomePage/>} />
        <Route path = '/login' element = {<LoginPage/>} />
        <Route path = '/profile' element = {<ProfilePage/>} />
      </Routes>
    </div>
  )
}

export default App
