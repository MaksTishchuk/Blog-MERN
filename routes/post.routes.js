import Router from 'express'
import {postCreateValidation} from './../validators/postValid.js'
import { createPost, getAllPosts, getOnePost, updatePost, deletePost, getLastTags } from './../controllers/PostController.js'
import checkAuth from "./../middlewares/checkAuth.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

const postRouter = Router()

postRouter.get('/tags', getLastTags)
postRouter.get('/', getAllPosts)
postRouter.get('/:id', getOnePost)
postRouter.post('', checkAuth, postCreateValidation, handleValidationErrors, createPost)
postRouter.patch('/:id', checkAuth, postCreateValidation, handleValidationErrors, updatePost)
postRouter.delete('/:id', checkAuth, deletePost)


export default postRouter
