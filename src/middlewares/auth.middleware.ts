import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { validateEmail } from "./validators/";
import { IPayload } from "../interfaces/auth";
import { ErrorHandler, handleError } from "../utils/error";
import DatabaseProvider from "../models";
import config from "config";


const { User, Role } = DatabaseProvider;

export const validateRegisterUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { correo } = req.body;
        if (!validateEmail(correo)) {
            return res.status(400).json({ msg: "field_name_invalid" })
        }
        const user = await User.findOne({
            where: {
                mail: correo
            }
        });
        if(user) {     
            return res.status(400).send({ success: false, data: "user_already_exists" })
        } else {
            next();
        }
    } catch (e) {
        console.log(e)
        const error = new ErrorHandler(401, e as string)
        return handleError(req, res, error);
    }
}

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tkn = req.header('Authorization');
        if (!tkn) return handleError(req, res, new ErrorHandler(401, 'access_denied'));
        const token = tkn ? tkn.replace("Bearer ", "") : "";
        const payload = jwt.verify(token, config.get("ACCESS_TOKEN_SECRET") as string) as IPayload;
        req.userId = payload.id;
        next();
    } catch (e) {
        const error = new ErrorHandler(401, e as string)
        return handleError(req, res, error);
    }
    
}

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req;

        const user = await User.findOne({
            where: {
                user_id: userId
            },
            include: {
                model: Role,
                as: 'roles',
                attributes: ['rol']
            }
            
        });
        if(user) {   
            if(!user.roles || !user.roles.find((el) => el.rol === 'admin'))  {
                return handleError(req, res, new ErrorHandler(403, 'access_denied'));
            } else {
                next();
            }
        } else {
            return handleError(req, res, new ErrorHandler(403, 'access_denied'));
        }
    } catch(e) {
        return handleError(req, res, new ErrorHandler(401, e ? e as string : 'server_Error'));
    }
};


