const express = require('express')
const router = express.Router()
const  { VerifyTokenAndAdmin } = require("../middlewares/verifyToken")
const {createCategory , GetAllCategories , DeletCategories} = require('../controller/categoriesController')


// api/categories
router.post('/',VerifyTokenAndAdmin,createCategory)
router.get('/',GetAllCategories)

// api/categories/:id
router.delete('/:id',VerifyTokenAndAdmin,DeletCategories)


















module.exports = router