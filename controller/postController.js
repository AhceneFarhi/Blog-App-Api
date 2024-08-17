const asyncHandler = require('express-async-handler')
const path = require('path')
const { cloudinaryUploadImage , cloudinaryRemoveImage} = require('../utils/cloudinary')
const fs = require('fs')
const {Post, validateCreatePost , validateUpdatePost} = require('../models/Post')
const {Comment} = require('../models/Comment')






/**--------------------------------------
 * @desc  Create a new post
 * @method Post
 * @router /api/posts/
 * @access private (only logged in users)
 *--------------------------------------*/

const CreatePost = asyncHandler(async(req,res)=>{

    // 1. validate image 

    if (!req.file) {
        return res.status(400).json({message:"no file provided"})
    }

    // 2. validate data 
    const {error} =  validateCreatePost(req.body)

    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }

    // 3. Upload image to cloudinary server
     const imagePath = path.join(__dirname ,`../images/${req.file.filename}`)
     const result = await cloudinaryUploadImage(imagePath)
    //  console.log(result);
    // 4. create new post  and save it to database DB

    const newPost = await Post.create({
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        user:req.user.id,
        image:{
            url: result.secure_url,
            publicId:result.public_id,
        },
    })

    // 5. send a response to the client 
    res.status(201).json(newPost)

    // 6. Remove photo from the folder images
    fs.unlinkSync(imagePath)
    
  })


/**--------------------------------------
 * @desc  get posts
 * @method Post
 * @router /api/posts/
 * @access public 
 *--------------------------------------*/

const getPosts = asyncHandler(async(req,res) => {

     const {pageNum,category} = req.query
     const Post_Per_Page = 3

       let posts;

     if (pageNum) {

        posts = await Post.find().skip((pageNum-1).Post_Per_Page).limit(Post_Per_Page).sort({creacreatedAt:-1}).populate("user",["-password"]).populate("comments")

     } else {
        if (category) {
            posts = await Post.find({ category: category}).sort({creacreatedAt:-1}).populate("user",["-password"]) 
        } else {
            posts = await Post.find().sort({creacreatedAt:-1}).populate("user",["-password"])             // .sort({creacreatedAt:-1}) : elle va trier le tableau depend on la date de creation 

        }
     }

     res.status(200).json(posts)
})






/**--------------------------------------
 * @desc  get single post
 * @method Post
 * @router /api/posts/:id
 * @access public 
 *--------------------------------------*/

const getSinglePosts = asyncHandler(async(req,res) => {

    const post = await Post.findById(req.params.id).populate("comments")

    if (!post) {
        return res.status(404).json({message:"Not Found"})
    }

    res.status(200).json(post)
})


/**--------------------------------------
 * @desc  get  post count
 * @method Post
 * @router /api/posts/count
 * @access public 
 *--------------------------------------*/

const getPostsCount = asyncHandler(async(req,res) => {

    const count = await Post.countDocuments()
    
    res.status(200).json(count)
})


/**--------------------------------------
 * @desc  delete post
 * @method delete
 * @router /api/posts/:id
 * @access private (only admin or user logged in) 
 *--------------------------------------*/

const deletePost = asyncHandler(async(req,res)=>{

    const post = await Post.findById(req.params.id)

    if (!post) {
       return res.status(404).json({message:"post no exist"})
    }


    if (req.user.isAdmin || req.user.id === post.user.toString()) {

      await Post.findByIdAndDelete(req.params.id)
      await cloudinaryRemoveImage(post.image.publicId)
      res.status(200).json({ message:"post deleted successfully"})

      // Delete all comments belong to this post
      await Comment.deleteMany({postId:post._id})

    } else {

       res.status(403).json({message:"access denied , forbidden"})

    }


})


/**--------------------------------------
 * @desc  Update post
 * @method Put
 * @router /api/posts/:id
 * @access private ( logged in user) 
 *--------------------------------------*/



const UpdatePost = asyncHandler(async(req,res) => {

  // 1. Validate information
  const {error} = validateUpdatePost(req.body)

  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  // 2. Check if the post exists in mongodb 

  const post = await Post.findById(req.params.id)

  if (!post) {
    return res.status(404).json({message:"The post does not exist !! "})
  }

  // 3. Check if the logged in user is the owner of the post 

  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({message:"You are not the owner of the post !! "})
  }

  // 4. Update the post 
 

 const updatePost =  await Post.findByIdAndUpdate(req.params.id, {
    $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
    }

  },{ new: true } ).populate( "user" , ["-password"] )

res.status(200).json(updatePost)
 

})


/**--------------------------------------
 * @desc  Update post Image
 * @method Put
 * @router /api/posts/update-image/:id
 * @access private ( logged in user) 
 *--------------------------------------*/


const UpdatePostImg = asyncHandler(async(req,res) => {

    // 1. Validate image

    if (!req.file) {
      return res.status(400).json({message:"no file provided !!"});
    }

    // 2. Check if the post exists in mongodb 

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({message:"The post does not exist !! "})
    }

    // 3. Check if the logged in user is the owner of the post 

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({message:"You are not the owner of the post !! "})
    }

    // 4. Delete tho old image  
    await cloudinaryRemoveImage(post.image.publicId)   
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(imagePath)
     console.log(result);
    // 5. Update the image

    const updatePost =  await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            image:{

                url:result.secure_url,
                publicId:result.public_id,

            }
        }

      },{ new: true } )

      res.status(200).json(updatePost)

      // 6. Delete the image form the server
      fs.unlinkSync(imagePath)

})



/**--------------------------------------
 * @desc  Toogle like
 * @method Put
 * @router /api/posts/likes/:id   // :id ( is for the post not id of user)
 * @access private ( logged in user) 
 *--------------------------------------*/









const ToogleLikes = asyncHandler(async(req,res) => {

  const {id:postId} = req.params

  let post = await Post.findById(postId)

  const {id:userId} = req.user

  const isUserLiked = post.likes.find((user) => user.toString() === userId)

  if (isUserLiked) {

    post=  await Post.findByIdAndUpdate(postId,{
      $pull:{likes:userId}

    },{new : true}).populate("likes",["-password"])

  } else {

    post=  await Post.findByIdAndUpdate(postId,{
      $push:{likes:userId}

    }, {new : true}).populate("likes",["-password"])
    
  }
  
  res.status(200).json(post)

})




















































































 




module.exports = {CreatePost , getPosts,getSinglePosts , getPostsCount , deletePost , UpdatePost , UpdatePostImg , ToogleLikes}