import { body } from 'express-validator';

export const validationsLogin = [
    body('mail').exists().withMessage('field_mail_needed'),
    body('password').exists().withMessage('field_password_needed'),
    body('mail').if(body('mail').exists()).isLength({ min: 7, max: 35 }).withMessage('field_mail_needed'),
    body('password').if(body('password').exists()).isLength({ min: 4, max: 35 }).withMessage('field_password_needed'),
]
