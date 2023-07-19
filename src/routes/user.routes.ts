import { Router } from "express"
import {
    validateRegisterUserData,
    authAdmin,
    validateToken
} from "../middlewares/auth.middleware";
//auth
import {
    forgotPassword,
    getAccessToken,
    LogIn,
    resetPassword,
    logout
} from "../controllers/auth.controller";
//users
import {
    editUserInfo,
    editUserRol,
    getAll,
    getUserProfile,
    editPersonalInfo,
    createUser,
    addOrEditUserPhoto,
    editUserPassword,
    deleteUserRoles,
} from "../controllers/user.controller";
//middlewares
import { validationsLogin } from "../middlewares/validators/auth/";
import { validatorMiddleware } from "../middlewares/validators/";
import { profilePhotoMiddleware } from "../middlewares/multer";

const router = Router();

//login
router.post("/login", validationsLogin, validatorMiddleware, LogIn);
//logout
router.post('/logout', logout);
//create AccessToken using serverside cookie RefreshToken
router.post("/access_token", getAccessToken);
//get current profile using access token
router.get('/get/profile', validateToken, getUserProfile);
//edit personal info
router.put('/edit/profile', validateToken, editPersonalInfo);
//edit personal photo
router.put('/edit/profile/photo', validateToken, profilePhotoMiddleware.single('user_photo'), addOrEditUserPhoto);
//route edit personal password, falta middleware validate Password
router.put('/edit/profile/password', validateToken, editUserPassword);
//get all users saved, just admins can get it
router.get('/get/all', validateToken, authAdmin, getAll);
//send forgotPassword request to email
router.post('/password/forgot', forgotPassword);
//reset password using AccessToken
router.post('/password/reset', validateToken, resetPassword);
//create new user
router.post("/create", validateRegisterUserData, createUser);
//edit user info
router.put('/edit/user', validateToken, editUserInfo);
//edit user roles
router.put('/edit/rol', validateToken, authAdmin, editUserRol);

router.delete('/delete/roles', deleteUserRoles);

export default router;