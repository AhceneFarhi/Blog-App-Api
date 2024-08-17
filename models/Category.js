const mongoose = require('mongoose')
const joi = require('joi')

const CategorySchema = new mongoose.Schema({ 
        userId:{

            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,

        },

        title:{

            type:String,
            required:true,
            trim:true,
        },


},{timestamps:true })

const Category = mongoose.model("Category",CategorySchema )

// Validate Create Category

function validateCreateCategory(obj) {
     const schema = joi.object({
        title:joi.string().trim().required().label(" The title of the category"),
     })

    return schema.validate(obj)
}






module.exports = {validateCreateCategory  , Category}
