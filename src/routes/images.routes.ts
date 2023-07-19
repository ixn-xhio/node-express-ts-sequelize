import { Router } from "express"
import { 
    authAdmin, 
    validateToken 
} from "../middlewares/auth.middleware";
import {
    getProfilePhoto,
 } from '../controllers/images.controller';

const router = Router();

router.get("/profile", validateToken, authAdmin, getProfilePhoto);


export default router;
