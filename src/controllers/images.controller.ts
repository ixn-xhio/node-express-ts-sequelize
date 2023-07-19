import { Request, Response } from "express";
const path = require('path');
import { handleError, ErrorHandler } from "../utils/error";

export const getProfilePhoto = async (req: Request, res: Response) => {
    try {
        const {
            img_nm
         } = req.query;
         res.sendFile(`${path.join(__dirname, '..', '..')}/assets/img/profile/${img_nm}`);
    } catch (e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }
}
