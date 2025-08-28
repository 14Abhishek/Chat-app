import express from "express"
import { checkAuth, login, signup, updateUserProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
// login changes state of server (generates token) and POST ensures login credentials are sent in body rather
// than URL... that is why we don't use GET ... but POST
userRouter.post("/login", login); 

userRouter.put("/update-profile", protectRoute, updateUserProfile)

userRouter.get("/check", protectRoute,checkAuth)

export default userRouter;