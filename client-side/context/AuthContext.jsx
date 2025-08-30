import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import {io} from 'socket.io-client'

// we got the URL where our backend is running from vite enviorment variable
const backendUrl = import.meta.env.VITE_BACKEND_URL
// then told axios to set the backend(url) as default base url for all HTTP requests..
// it will automatically prepend this to all those routes i set in http requests 
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

    cosnt [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)

    // Check if user is authenticated and if so set the user data and connect the socket
    const checkAuth = async()=>{  // we wanna execute this thing whenever we open a web page so we use useEffect hook
        try {
            const {data}  = await axios.get("/api/check") // userController function that tells if user is authenticated
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            // a toast notifiaction 
            toast.error(error.message)

        }
    }


    //connect soket functin to handle socket connectoins and online users update
    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket  = io(backendUrl, {
            query:{
                // we send userId to backend as a part of connection ... this userid then gets added to socket map(dictionary) during handhsake event (see server.js)
                userId: userData._id,
            }
        })
        newSocket.connect()
        setSocket(newSocket)
        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds)
        })
    }

    useEffect(()=>{
        if(token){
            // sets authorization header for any subsequent axios requests
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()
    }, [])


    // whatever we make inside this objects will be accecible to our children
    const value = {
        axios, // it has our base url so its important
        authUser,
        onlineUsers,
        socket
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}