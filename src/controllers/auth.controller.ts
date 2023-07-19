import {
    Request,
    Response
} from "express";
import config from "config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendMail from '../utils/sendMail';

import {
    createAccessToken,
    createRefreshToken
} from "../utils/tokens";

import { IPayload } from "../interfaces/auth";
import { ErrorHandler, handleError } from "../utils/error";

import { Op } from "sequelize";
import DatabaseProvider from "../models";

const { User } = DatabaseProvider;


export const LogIn = async (req: Request, res: Response) => {
    try {
        const {
            mail,
            password
        } = req.body;
    
        const user = await User.findOne({
            where: {
                mail: {
                    [Op.eq]: mail
                }
            }
        });

    
        if(!user){
            return handleError(req, res, new ErrorHandler(409, "conflict"))
        };

        var result = bcrypt.compareSync(password, user.password);

        if (result == true) {
            const refresh_token = createRefreshToken({ id: user.user_id })
            res.cookie('refreshtoken', refresh_token, {
                secure: false,
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
            })
            return res.status(200).json({
                message: "Login Succesfull"
            })
        } else {
            return handleError(req, res, new ErrorHandler(400, 'invalid_password'));
        }
    } catch (e){
        console.log(e)
        return handleError(req, res, new ErrorHandler(400, e ? e as string : 'server_error'));
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('refreshtoken');
        return res.status(200).json({ success: true, msg: "Logged out." });
    } catch (e){
        return handleError(req, res, new ErrorHandler(400, e ? e as string : 'server_error'));
    }
};

export const getAccessToken = async (req: Request, res: Response) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token) {
            return res.status(400).json({ msg: "Please login now!" })
        }
        const payload = jwt.verify(rf_token, config.get("REFRESH_TOKEN_SECRET") as string) as IPayload;

        if (!payload) {
            return res.status(400).json({ msg: "Please login now!" })
        }

        const access_token = createAccessToken({ id: payload.id })
        res.status(200).json({ access_token })

    } catch (e){
        return handleError(req, res, new ErrorHandler(400, e ? e as string : 'server_error'));
    }
}

export const forgotPassword = async (req: Request, res: Response) => {

    try {
        const { email } = req.body

        const user = await User.findOne({
            where: {
                mail: {
                    [Op.eq]: email
                }
            }
        })
    
        if(!user){
            return handleError(req, res, new ErrorHandler(409, "conflict"))
        }
    
        const access_token = createAccessToken({ id: user.user_id })
        const url = `${config.get('CLIENT_URL')}?reset_password_code=${access_token}`
        sendMail(email, url, "Reset your password")
        res.status(200).json({ success: true, msg: "Re-send the password, please check your email." })
    
    } catch (e){
        console.log(e)
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }

}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const passwordHash = bcrypt.hashSync(password);
        const { userId } = req;

        const user = await User.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            }
        })
    
        if(!user){
            return handleError(req, res, new ErrorHandler(409, "conflict"));
        }
        await user.update({
            password: passwordHash
        });

        return res.status(200).json({
            sucess: true,
            message: "updated"
        });

    } catch (e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }
}
