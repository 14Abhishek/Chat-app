import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";


export const ChatContext = createContext()

export const ChatProvider = ({children}) => {
    
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({}) // notice we have an empty ->Object<- here
    
    const {socket, axios} = useContext(AuthContext)

    // function to get users in sidebar
    const getUsers = async () => {
        try {
            const {data} = await axios.get("/api/messages/users")
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
            else{
                
                toast.error(data.message)
            }
        } catch (error) {
            console.log('two')
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`)
            if(data.success){
                setMessages(data.messages)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(data)
            toast.error(error.message)
        }
    }


    //funciton to send the message to selected user
    const sendMessage = async (messageData) => {
        try {
            if (!selectedUser?._id) {
                toast.error("No user selected to send message to.");
                return;
            }
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message+"some shit happend")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to subscribe to messages for selected user.. 
    const subscirbeToMessages = async () => {
        if(!socket) return;
        // whenever new message  emits on socket it will instantly display it
        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){ // new message came from the chat we have opened
                newMessage.seen = true
                setMessages((prevMessages)=>[...prevMessages,newMessage])
                axios.patch(`/api/messages/mark/${selectedUser._id}`)
            }else{ // we are checking to see that if the newMessage did not come from our selectedUser (the chat we have opened) then whoever sent us that new message we will increase the count of their unseen messages by one... or if its their first message then set it as 1
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, 
                    [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
// unseen message is an object with key:senderId value:messageCount so to add another entry we check has this guy sent us unseen message before ... if yes then we increment the message count ..if no then set the count as 1 
                }))
            }
        })
    }

    // function to unsubscribe to the messsages
    const unsubscribeFromMessages = () =>{
        if(socket) socket.off("newMessage")
    }

    // whenever we open the page we wnat to run subscribing and unsubscribing functions
    useEffect(()=>{
        subscirbeToMessages()
        return ()=>{
            unsubscribeFromMessages()
            // a cleanup function 
        }
    }, [socket, selectedUser])
// we execute useEffect and those functions whenever we connect or disconnect our socket, OR whenever we open some other guy chat


    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        setMessages,
        sendMessage,
        setSelectedUser,
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value= {value}>
            {children}
        </ChatContext.Provider>
    )
}