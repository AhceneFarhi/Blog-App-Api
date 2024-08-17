const asyncHandler = require('express-async-handler')
const path = require('path')
const fs = require('fs')
const {Post} = require('../models/Post')
const {User} = require('../models/User')
const {validateCreateComment , validateUpdateComment , Comment} = require('../models/Comment')


/**--------------------------------------
 * @desc  Create a new Comment
 * @method Post
 * @router /api/comments/
 * @access private (only logged in users)
 *--------------------------------------*/

const createComment = asyncHandler(async(req,res)=>{

     const {error} = validateCreateComment(req.body)

     if (error) {
        return res.status(400).json({message: error.details[0].message})
     }

    const profileUser = await User.findById(req.user.id)

    const comment = await Comment.create({

        postId:req.body.postId,
        text:req.body.text,
        userId:req.user.id,
        username:profileUser.username,

    })

    res.status(201).json(comment)  // (201) : it means that the comment has been created successfully

})


/**--------------------------------------
 * @desc  Get all Comments
 * @method get
 * @router /api/comments/
 * @access private (only admin)
 *--------------------------------------*/

const GetAllComments = asyncHandler(async(req,res)=>{
     const allComments = await Comment.find().populate("userId")

     res.status(200).json(allComments)
})


/**--------------------------------------
 * @desc  Delete  Comments
 * @method Delete
 * @router /api/comments/:id
 * @access private (only admin and the owner)
 *--------------------------------------*/

const DelteCommnents = asyncHandler(async(req,res)=>{
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
        return res.status(404).json({message:"comment not found"})
    }

    if (req.user.isAdmin || req.user.id === comment.userId.toString()) {
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json({message:" comment has been deleted successufly "})
    } else {
        return res.status(403).json({message:"You do not have permission to delete this comment"})
    }

})

/**--------------------------------------
 * @desc  Update  Comments
 * @method put
 * @router /api/comments/:id
 * @access private (only the owner of the comment)
 *--------------------------------------*/




const UpdateComment = asyncHandler(async(req,res)=>{

    const {id:comment_Id} = req.params
    const {id:user_id} = req.user

     const {error} = validateUpdateComment(req.body)

     if (error) {
        return res.status(200).json({message:error.details[0].message})
     }

     const comment = await Comment.findById(comment_Id)

     if (!comment) {
        return res.status(404).json({message:"Comment not found"})
     }

if (user_id !== comment.userId.toString()) {
    return res.status(403).json({message:" You do not have permission to update this comment"})
}

  const newComment =  await Comment.findByIdAndUpdate(comment_Id,{
        $set:{
            text:req.body.text,
        }
     },{new:true})//.populate("userId",["-password"])

     res.status(200).json(newComment)

})







module.exports = {createComment , GetAllComments , DelteCommnents , UpdateComment}