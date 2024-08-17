const asyncHandler = require('express-async-handler')
const {Category,validateCreateCategory} = require('../models/Category')


/**--------------------------------------
 * @desc  Create a new Category
 * @method Post
 * @router /api/categories/
 * @access private (only Admin)
    *--------------------------------------*/

const createCategory = asyncHandler(async(req,res)=>{
     const {error} = validateCreateCategory(req.body)

     if (error) {
        return res.status(400).json({message: error.details[0].message});
     }

     const category = await Category.create({
          title: req.body.title,
          userId: req.user.id,
     })

     res.status(201).json(category)

})


/**--------------------------------------
 * @desc  Get all Categories
 * @method Post
 * @router /api/categories/
 * @access public 
 *--------------------------------------*/

const GetAllCategories = asyncHandler(async(req,res)=>{
    
    const AllCategories = await Category.find()
     
    res.status(200).json(AllCategories)
})
 


/**--------------------------------------
 * @desc  Delet  Categories
 * @method delete
 * @router /api/categories/:id
 * @access private (only Adimin) 
 *--------------------------------------*/

const DeletCategories = asyncHandler(async(req,res)=>{
    
    const {id:categoryID} = req.params

    const category = await Category.findById(categoryID)

    if (!category) {
        return res.status(404).json({message: 'Not Found'})
    }

    await Category.findByIdAndDelete(categoryID)

    res.status(200).json({message:"Category deleted successfully"})
    
})






module.exports = {createCategory , GetAllCategories , DeletCategories}
