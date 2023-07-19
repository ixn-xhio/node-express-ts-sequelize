import {
    Request,
    Response
} from "express";
import bcrypt from "bcryptjs";
import fs from 'fs-extra';
import path from "path";
import { 
    ErrorHandler, 
    handleError 
} from "../utils/error";
import moment from "moment";

import DatabaseProvider from "../models";
import { Op } from "sequelize";


const { 
    User, 
    Role, 
    Users_Roles
} = DatabaseProvider;

export const createUser = async (req: Request, res: Response) => {
    try {
        const {
            nombre,
            apellidos,
            correo,
            contraseña,
            rol_id
        } = req.body;

        const passwordHash = bcrypt.hashSync(contraseña);
        
        const newUser = await User.create({
            name: nombre,
            lastnames: apellidos,
            mail: correo,
            password: passwordHash,
        });

        const respUserxRol = await Users_Roles.create({
            user_id: newUser.user_id,
            rol_id: rol_id
        });

        return res.status(200).json({
            success: true,
            data: {
                user: newUser,
                rol: respUserxRol
            }
        });

    } catch (e) {
        console.log(e)
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req;
        const user = await User.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            },
            include: {
                model: Role,
                as: 'roles',
                attributes: ['rol']

            }
        });
                
        if (user === null) {
            return handleError(req, res, new ErrorHandler(409, 'conflict'));
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    }catch(e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }

}

export const getAll = async (req: Request, res: Response) => {
    try {
        const users = User.findAll({
            include: {
                model: Role,
                as: 'roles',
                attributes: ['rol']
            }
        });
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }
}

export const editPersonalInfo = async (req: Request, res: Response) => {
    try {
        const { userId } = req;
        const { nombre, apellidos, correo } = req.body;

        const user = await User.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            },
            include: {
                model: Role,
                as: 'roles',
                attributes: ['rol']

            }
        });
                
        if (user === null) {
            return handleError(req, res, new ErrorHandler(409, 'conflict'));
        }

        await User.update(
            {
                name: nombre,
                lastnames: apellidos,
                mail: correo
            },
            {
                where: {
                    user_id: userId
                },
                individualHooks: true,
                limit: 1
            }
        )

        return res.status(200).json({
            success: true,
            msg: "updated"
        });
    } catch (e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }
}

export const editUserInfo = async (req: Request, res: Response) => {
    try {
        const { nombre, apellidos, correo, user_id } = req.body;

        const validExists = await User.findOne({
            where: {
                user_id: {
                    [Op.eq]: user_id
                }
            }
        })
        
        if (validExists === null) {
            return handleError(req, res, new ErrorHandler(409, 'conflict'));
        }

        await User.update(
            {
                name: nombre,
                lastnames: apellidos,
                mail: correo
            },
            {
                where: {
                    user_id: user_id
                },
                individualHooks: true,
                limit: 1
            }
        )

        return res.status(200).json({
            success: true,
            msg: "updated"
        })
    } catch (e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }
}

export const editUserPassword = async (req: Request, res: Response) => {
    try {
        const { password, oldPassword } = req.body;
        const passwordHash = await bcrypt.hash(password, 12);


        const { userId } = req;

        const validExists = await User.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            }
        })
        
        if (validExists === null) {
            return handleError(req, res, new ErrorHandler(409, 'conflict'));
        }

        var result = bcrypt.compareSync(oldPassword, validExists.password);
        if(result !== true) {
            return handleError(req, res, new ErrorHandler(400, 'invalid_password'));
        }
        
        await User.update({ password: passwordHash },
            {
                where: {
                    user_id: userId
                },
                individualHooks: true,
                limit: 1
            })

        return res.status(200).json({
            success: true,
            msg: "updated"
        });
    } catch (e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_error'));
    }
}

export const addOrEditUserPhoto = async (req: Request, res: Response) => {
    try {
        const { userId } = req;
        console.log(req.file!.path.toString())
        const new_photo_path = req.file!.path.toString().slice(19);
        const user = await User.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            }
        })
        if(!user) {
            return handleError(req, res, new ErrorHandler(400, 'user_not_found'));
        } 
        if (user.photo_path !== null && user.photo_path !== '') {
            try {
                await fs.unlink(`${path.join(__dirname, '..', '..')}/assets/img/profile/${user.photo_path.replace('\\', '/')}`);
            } catch (e) {
                console.error(e);
            }
        }

        await User.update(
            {
                photo_path: new_photo_path
            },
            {
                where: {
                    user_id: userId
                },
                individualHooks: true,
                limit: 1
            }
        )

        return res.status(200).json({
            success: true,
            msg: "updated"
        });
    }catch(e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_Error'));
    }
}

export const editUserRol = async (req: Request, res: Response) => {
    try {
        const {
            rol_id,
            user_id
        } = req.body;
    
        const oldUserRoles = await Role.findAll({
            where: {
                rol_id: {
                    [Op.eq]: user_id
                }
            }
        })
    
        oldUserRoles.forEach(async (el) => {
            await el.destroy();
        });
    
        const respUserxRol = await Users_Roles.create({
            user_id: user_id,
            rol_id: rol_id
        });
    
        return res.status(200).json({
            success: true,
            data: respUserxRol
        });
    
    } catch(e) {
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_Error'));     
    }
}

export const deleteUserRoles = async (req: Request, res: Response) => {
    try {
        const {
            rol_id,
            user_id,
        } = req.body;
    
        // let user = await User.findOne({
        //     where: {
        //         user_id: {
        //             [Op.eq]: user_id
        //         }
        //     }
        // });

        const oldUserRoles = await Users_Roles.findAll({
            where: {
                rol_id: {
                    [Op.eq]: user_id
                }
            }
        });
        
        oldUserRoles.forEach((el) => {
            el.destroy();
        })
        
        const user = await User.findOne({
            where: {
                user_id: {
                    [Op.eq]: user_id
                }
            },
            include: {
                model: Role,
                as: 'roles',
                attributes: ['rol']
            }
        });

        const  newRole = await Role.findOne({
            where: {
                rol_id: rol_id
            }
        })

        if(user) {
            if(newRole) {
                user.addRole(newRole);
            }
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    
    } catch(e) {
        console.log(e)
        return handleError(req, res, new ErrorHandler(500, e ? e as string : 'server_Error'));     
    }
}

