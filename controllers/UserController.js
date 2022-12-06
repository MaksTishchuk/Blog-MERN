import bcrypt from "bcrypt";
import UserModel from "./../models/User.js";
import jwt from "jsonwebtoken";
import config from "config";

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const userData = new UserModel({
            email: req.body.email,
            password: passwordHash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        })
        await userData.save()

        const token = jwt.sign(
            {
                _id: userData._id
            },
            config.get('jwtSecret'),
            {
                expiresIn: '1h'
            }
        )
        res.json({ ...userData, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!'})
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({
                message: 'User with this email wasn`t found!'
            })
        }
        const isValidPassword = await bcrypt.compare(req.body.password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({
                message: 'Invalid Email or password!'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            config.get('jwtSecret'),
            {
                expiresIn: '1h'
            }
        )
        // Вытащим пароль из пользователя, чтобы не возвращать его на фронт
        const {password, ...userData} = user._doc
        res.json({ ...userData, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!'})
    }
}

export const userInfo = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({ message: 'User wasn`t found!' })
        }
        const {password, ...userData} = user._doc
        res.json(userData)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Access denied!'})
    }
}
