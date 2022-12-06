import Router from 'express'
import {registerValidation, loginValidation} from './../validators/authValid.js'
import checkAuth from './../middlewares/checkAuth.js'
import { register, login, userInfo } from './../controllers/UserController.js'
import handleValidationErrors from "./../middlewares/handleValidationErrors.js";


const authRouter = Router()

authRouter.post('/register', registerValidation, handleValidationErrors, register)

authRouter.post('/login', loginValidation, handleValidationErrors, login)

authRouter.get('/me', checkAuth, userInfo)

export default authRouter
