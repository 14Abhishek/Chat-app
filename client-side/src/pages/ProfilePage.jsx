import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage(){
    
    const {authUser, updateProfile} = useState(AuthContext)
    
    const [selectedImage, setSelectedImage] = useState(null)
    const nav = useNavigate()
    const [name, setName] = useState(authUser.fullName || "Jhon Doe")
    const [bio, setBio] = useState(authUser.bio || "Hi, how's the project?..msg me any feedback plz")
    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(!selectedImage){ // if image is not selected
            await updateProfile({fullName: name, bio})
            nav('/')
            return;
        }// but if the image is selected ... we have to convert it into base64

        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = async () => {
            const base64Image = reader.result;
            await updateProfile({profilePic: base64Image,fullName:name, bio });
            nav('/')
        }
    }
    return (
        <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
        <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse">
            <form onSubmit = {handleSubmit}className="flex flex-col gap-5 p-10 flex-1">
                <h3 className="text-lg">Profile Details</h3>
                <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
                    <input onChange={(e)=>setSelectedImage(e.target.files[0])} type="file" id="avatar" accept=".png , .jpg, .jpeg" hidden/>
                    {/* URL.createObjectURL() creates a temporary preview URL in the browser) */}
                    <img src={selectedImage? URL.createObjectURL(selectedImage):assets.avatar_icon} className={`w-12 h-12 ${selectedImage && 'rounded-full'}`} alt="" />
                    upload a sexy image plz (only sexy)
                </label>
                <input onChange={(e) =>setName(e.target.value)} value={name} type="text" required placeholder="Kimi no Namae Wa" name="" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus-ring-violet-500" />
                <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder="bio bio bye O .. oh oh oh" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" rows={4}></textarea>
                <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer">Save</button>
            </form>
                 <img src={assets.logo_icon} className={`max-w-44 aspect-square rounded-full mx-10 max:sm:mt-10 ${selectedImage && 'rounded-full'}`}
                  />
        </div>
        </div>
    )
}
export { ProfilePage};