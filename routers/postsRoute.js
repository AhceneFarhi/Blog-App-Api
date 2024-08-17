const express = require('express')
const router = express.Router()
const  { VerifyToken } = require("../middlewares/verifyToken")
const photoUpload = require('../middlewares/photoUpload')
const { CreatePost, getPosts, getSinglePosts, getPostsCount , deletePost, UpdatePost , UpdatePostImg, ToogleLikes} = require('../controller/postController')


// api/posts
router.post('/',VerifyToken,photoUpload.single('image'),CreatePost)
router.get('/',getPosts)

// api/posts/count
router.get('/count',getPostsCount)

// api/posts/:id
router.get('/:id',getSinglePosts)
router.delete('/:id',VerifyToken,deletePost)
router.put('/:id',VerifyToken,UpdatePost)


// api/posts/update-image/:id
router.put('/update-image/:id',VerifyToken,photoUpload.single("image"),UpdatePostImg)

// api/posts/likes/:id
router.put('/likes/:id',VerifyToken,ToogleLikes)




module.exports = router


















