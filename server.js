import express from 'express'
import fs from 'fs'
import config from 'config'
import mongoose from "mongoose";
import multer from 'multer'
import cors from 'cors'
import authRouter from './routes/auth.routes.js'
import postRouter from './routes/post.routes.js'
import checkAuth from "./middlewares/checkAuth.js";


mongoose
    .connect(config.get('mongoURI'))
    .then(() => console.log('Database has been connected!'))
    .catch((error) => console.log('DB error', error))

const server = express()
const PORT = config.get('PORT') || 4000

server.use(express.json())
server.use(express.urlencoded({extended: false}))
server.use(cors())

// Создаем хранилище для картинок (_ - request, __ - файл)
const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        callback(null, 'uploads') // null - нет ошибок, второй - папка загрузки
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname) // достаем название файла для сохранения
    },
})
// Применим хранилище для express
const upload = multer({ storage })

// Отдаем статику из папки uploads
server.use('/uploads', express.static('uploads'));

// Создадим роутер для загрузки файлов
server.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

server.use('/auth', authRouter)
server.use('/posts', postRouter)


server.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server has been started on port ${PORT}!`)
})
