import config from "config";
import jwt from "jsonwebtoken"
import { IPayload } from "../interfaces/auth";
import { IUserPayload } from "../interfaces/models/user";

export const createActivationToken = (userPayload: IUserPayload) => {
    return jwt.sign(userPayload, config.get('ACTIVATION_TOKEN_SECRET') as string, {expiresIn: '5m'})
}

export const createAccessToken = (payload: IPayload) => {
    return jwt.sign(payload, config.get('ACCESS_TOKEN_SECRET') as string, {expiresIn: '15m'})
}

export const createRefreshToken = (payload: IPayload) => {
    return jwt.sign(payload, config.get('REFRESH_TOKEN_SECRET')  as string, {expiresIn: '7d'})
}
