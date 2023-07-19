export type IUserEntity = {
    user_id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    contraseña: string;
    photo_path: string;
}

export type IUserPayload = {
    nombre: string;
    apellidos: string;
    correo: string;
    contraseña: string;
}

export type IRegisterUser = {
    nombre: string;
    apellidos: string;
    correo: string;
    contraseña: string;
    rol: number;
}

export type IUserAndRolStateEntity = {
    user_id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    contraseña: string;
    rol: string;
}

export type IUserAndRolStatePayload = {
    user_id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    rol: string;
    photo_path: string;
}

export type IUserAndRolStateProtectedPayload = {
    nombre: string;
    apellidos: string;
    correo: string;
    contraseña: string;
    rol_id: number;
}

export type IUserEdit = { 
    user_id: number;
    nombre: string;
    apellidos: string;
    correo: string;
}