const express = require('express')
const router = express.Router()
const {GetAllUsers,GetUserById,UpdateUser , GetUsersCount , ProfilePhotoUpload, DeleteUser} = require("../controller/usersController")
const  {VerifyTokenAndAdmin , VerifyTokenAndUser, VerifyToken , VerifyTokenAndAuthorization} = require("../middlewares/verifyToken")
const photoUpload = require('../middlewares/photoUpload')


router.get('/profile',VerifyTokenAndAdmin, GetAllUsers)

router.get('/profile/:id', GetUserById)

router.put('/profile/:id',VerifyTokenAndUser,UpdateUser )

router.get('/count',VerifyTokenAndAdmin, GetUsersCount)

router.post('/profile/photoProfile',VerifyToken,photoUpload.single("image"), ProfilePhotoUpload)

router.delete('/profile/:id', VerifyTokenAndAuthorization,DeleteUser )






module.exports = router