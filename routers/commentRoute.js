const express = require('express')
const router = express.Router()
const  { VerifyToken, VerifyTokenAndAdmin } = require("../middlewares/verifyToken")
const {createComment, GetAllComments , DelteCommnents, UpdateComment} = require('../controller/commentsController')

// api/comments
router.post("/",VerifyToken,createComment)
router.get("/",VerifyTokenAndAdmin,GetAllComments)


// api/comments/:id
router.delete("/:id",VerifyToken,DelteCommnents)
router.put("/:id",VerifyToken,UpdateComment)










module.exports = router
