import React,{useContext, useState} from "react";
import assets  from'../assets/assets'
import { AuthContext } from "../../context/AuthContext";
function LoginPage() {
    const [currState, setCurrentState] = useState("Sign up")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [isDataSubmitted, setIsDataSubmitted] = useState(false)
    const onSubmitHandler = (event)=>{
        event.preventDefault()
        if(currState==="Sign up" && !isDataSubmitted){
            setIsDataSubmitted(true)
            return;
        }
        login(currState === "Sign up"? 'signup':'login', {fullName, bio, email, password})
    }

    // handling that login/signup
    const {login} = useContext(AuthContext)


    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">


        {/* -----Left Screen------- */}
        <img src={assets.logo_big} alt="" className="w-[min(30vw, 250px)]"/>
        {/* -----Right Screen-------------- */}
        <form onSubmit={onSubmitHandler} className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
            {currState} 
            {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer"/>}
        </h2>
        {/* sign up form  */}
        {currState === "Sign up" && !isDataSubmitted && (<input onChange={(e)=>setFullName(e.target.value)} type="text" value={fullName} className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder="Full Name" required></input>)}
        {!isDataSubmitted && (
            <>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Electronic Male Address" required className="p-2  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="dont enter password" required className="p-2  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </>)
        }

            {/* Bio */}
            {
                currState === "Sign up" && isDataSubmitted && (
                    <textarea onChange={(e) =>setBio(e.target.value)} value={bio} rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus-ring-indigo-500" placeholder="write some embarressing bio here (short)" required></textarea>
                )
            }

            {/* Submit button */}
            <button type="Submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md curosr-pointer">
                {currState==="Sign up" ? "Create Accout": "Login Now"}
            </button>

            {/* Privacy Policy Checkbox */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <input type="checkbox" />
                <p>Agrii to the terms of use & privacy policy</p>
            </div>

                {/* You Either lock.. i mean log in .. or Sign up!  */}
            <div className="flex flex-col gap-2">
                {currState ==="Sign up" ? 
                (
                    <p className="text-sm text-gray-600">Already have an Account? <span onClick={()=>{setCurrentState("Login");setIsDataSubmitted(false)}} className="font-medium text-violet-500 cursor-pointer">Login Here</span></p>
                ):
                (
                    <p className="text-sm text-gray-600">Create an Account <span onClick={()=>setCurrentState("Sign up")} className="font-medium text-violet-500 cursor-pointer">Click here</span></p>
                )}
            </div>


        </form>
        </div>

    )
}

export { LoginPage };