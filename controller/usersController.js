const asyncHandler = require('express-async-handler')
const {User, validateUpdateUser} = require('../models/User')
const {Post} = require('../models/Post')
const {Comment} = require('../models/Comment')
const bcrypt = require('bcryptjs')
const { json } = require('express')
const path = require('path')
const { cloudinaryUploadImage, cloudinaryRemoveImage , cloudinaryRemoveMultImage} = require('../utils/cloudinary')
const fs = require('fs')


/**--------------------------------------
 * @desc Get All Users 
 * @method Get
 * @router /api/users/profile
 * @access private (only Admin)
 *--------------------------------------*/

const GetAllUsers = asyncHandler(async(req,res)=>{

const users = await User.find().select("-password").populate("posts")  // for virtual

res.status(200).json(users)

})


/**--------------------------------------
 * @desc Get User by Id
 * @method Get
 * @router /api/users/profile/:id
 * @access public
 *--------------------------------------*/

const GetUserById = asyncHandler(async(req,res)=>{

    const user = await User.findById(req.params.id).select("-password").populate("posts") // for virtual 
    
    if (!user) {
        req.status(404).json({message:"User not found"})
    }

    res.status(200).json(user)
    
    })
    


/**--------------------------------------
 * @desc Update User
 * @method Put
 * @router /api/users/profile/:id
 * @access private (only himself)
 *--------------------------------------*/

const UpdateUser = asyncHandler(async(req,res)=>{

    const {error} = validateUpdateUser(req.body)
    
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }
    
    if (req.body.password) {
        
           //------------- Cryptage de password  //-------------------------
           const salt = await bcrypt.genSalt(10)
           req.body.password = await bcrypt.hash(req.body.password,salt)
           //-------------------------------------------------------------------
    }
    
    const result=  await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio
        }
      },{new: true}).select("-password")
    
        res.status(200).json(result)
        
        })
        

/**--------------------------------------
 * @desc Count of users 
 * @method Get
 * @router /api/users/count
 * @access private (only Admin)
 *--------------------------------------*/

const GetUsersCount = asyncHandler(async(req,res)=>{

    const count = await User.countDocuments()
    
    res.status(200).json(count)
    
    })
    


/**--------------------------------------
 * @desc profile photo upload 
 * @method post
 * @router /api/users/profile/photoProfile
 * @access private (only logged in users)
 *--------------------------------------*/


const ProfilePhotoUpload = asyncHandler(async(req,res)=>{

       // 1. validation image

       if (!req.file) {
        return res.status(400).json({message:"no file provided"})
       }

       // 2. get the path to the image
       const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
       console.log(imagePath);

       // 3. upload to cloudinary
       const result = await cloudinaryUploadImage(imagePath)
       console.log(result);

       // 4. Get the user from DB
       const user = await User.findById(req.user.id)
       
       // 5. Delete the old photo if it exists

       if (user.profilPhoto.publicId !== null) {
          await cloudinaryRemoveImage(user.profilPhoto.publicId )
       }
       // 6. Change the photoProfile field in the DB
           user.profilPhoto = {

            url: result.secure_url,
            publicId:result.public_id,

           }

           await user.save();
       // 7. Send response to client
    res.status(200).json({
        message:"Your profile photo has been uploaded successfully",
        profilPhoto:{ url: result.secure_url ,  publicId:result.public_id,}
    })


    // 8. Remove image from the server

    fs.unlinkSync(imagePath)

})




/**--------------------------------------
 * @desc Delete Users (Account)
 * @method Delete
 * @router /api/users/profile/:id
 * @access private (Only Admin or user himself)
 *--------------------------------------*/








const DeleteUser = asyncHandler(async(req,res)=>{
    // 1.Get the user from the DB
   const user = await User.findById(req.params.id);

   if (!user) {
     return  res.status(404).json({message:"User not found"});
   }

   // 2. Get All posts from DB
      const posts = await Post.find({user:user._id})

   // 3. Get the public ids from the posts
    const publicIds =  posts?.map((post) => post.image.public_id)

   // 4.Delete all posts imges from Cloudinary
   if (publicIds?.length > 0) {
       await cloudinaryRemoveMultImage(publicIds)
   }
    
   // 5. Delete the photo profile from Cloudinary
   await cloudinaryRemoveImage(user.profilPhoto.publicId )

   // 6. Delete user posts && comments from DB
    await Post.deleteMany({user:user._id})
    await Comment.deleteMany({userId:user._id})
   
await User.findByIdAndDelete(req.params.id)

res.status(200).json({message:"User deleted successfully"});

})



























































module.exports = {GetAllUsers,GetUserById, UpdateUser  , GetUsersCount , ProfilePhotoUpload , DeleteUser}