import PostModel from './../models/Post.js'

export const createPost = async (req, res) => {
    try {
        const post = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(', '),
            user: req.userId
        })

        await post.save()
        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Post wasn`t created!'})
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().sort('-_id').populate('user').exec()
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!'})
    }
}

export const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id
        PostModel.findOneAndUpdate(
            {_id: postId}, {$inc: { viewsCount: 1 }}, { returnDocument: 'after'},
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({message: 'Something went wrong!'})
                }
                if (!doc) {
                    return res.status(404).json({ message: 'Post wasn`t found' })
                }
                res.json(doc)
            }
        ).populate('user')
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!'})
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        PostModel.findByIdAndDelete({ _id: postId }, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: 'Something went wrong!'})
            }
            if (!doc) {
                return res.status(404).json({ message: 'Post wasn`t found' })
            }
            res.json({ message: 'Post was deleted!' })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!'})
    }
}

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne(
            {_id: postId},
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(', '),
                user: req.userId,
            }
        )
        res.json({ message: 'Post was updated!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!'})
    }
}


export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).sort('-_id').exec()
        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)
        res.json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!'})
    }
}
