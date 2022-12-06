import { body } from 'express-validator'

export const registerValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Minimal password length 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Minimal name length 3 symbols').isLength({ min: 3 }),
    body('avatarUrl', 'Invalid link on avatar').optional().isURL()
]

export const loginValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Minimal password length 5 symbols').isLength({ min: 5 }),
]
