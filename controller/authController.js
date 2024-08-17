const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const {User,validateRegisterUser, validateLoginUser} = require('../models/User')
const jwt = require('jsonwebtoken')



/**
 * @desc Register new user 
 * @method Post
 * @router /api/auth/register
 * @access public
 */


const RegisterUser = asyncHandler(async(req,res)=>{
      // validate info register user
      // is user existing
      // hash the password

      const {error} = validateRegisterUser()
      if (error) {
          return res.status(400).json({message: error.details[0].message})
      }


      const user = await User.findOne({ email: req.body.email})

      if (user) {
        return res.status(400).json({message:"User already registered"})
      }

      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password,salt)

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,

      })

      const result= await newUser.save()
      //------------------  Token --------------------
          const token = jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin} , process.env.SECRET_KEY)
          const {password,...other} = result._doc;
     
          res.status(201).json({...other,token})

})



/**
 * @desc LOGIN User 
 * @method Post
 * @router /api/auth/login
 * @access public
 */

const LoginUser = asyncHandler(async(req,res)=>{
 // validate info login user
      // is user existing
    

      const {error} = validateLoginUser()

      if (error) {
          return res.status(400).json({message: error.details[0].message})
      }

      const user = await User.findOne({email: req.body.email})

      if (!user) {
       return  res.status(400).json({message:"User not found"})
      }

      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)

    if (!isPasswordMatch) {
        return res.status(400).json({message: 'password invalid'}) 
    }

       //------------------  Token --------------------
   const token = jwt.sign({id:user._id,isAdmin:user.isAdmin} , process.env.SECRET_KEY)
   const {password,...other} = user._doc;

   res.status(201).json({...other,token})


})







module.exports = {RegisterUser , LoginUser}