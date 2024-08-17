const mongoose = require('mongoose')
const joi = require('joi')

const commentSchema = new mongoose.Schema({

     postId:{

        type: mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,

         },
        
        userId:{

            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,

        },

        text:{

            type:String,
            required:true,
        },

        username:{
            type:String,
            required:true,
        }

},{timestamps:true })

const Comment = mongoose.model("Comment",commentSchema)

// Validate Create Comment

function validateCreateComment(obj) {
     const schema = joi.object({
        postId:joi.string().required(),
        text:joi.string().trim().required(),
     })

    return schema.validate(obj)
}

// Validate Update Comment

function validateUpdateComment(obj) {
    const schema = joi.object({
       text:joi.string().trim().required(),
    })

   return schema.validate(obj)
}




module.exports = {validateCreateComment , validateUpdateComment , Comment}
