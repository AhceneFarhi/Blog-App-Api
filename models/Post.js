

const mongoose = require('mongoose')
const joi = require('joi')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        trim:true,
        required: true,  
        minlength:2,
        maxlength:10,
    },

    description:{
        type: String,
        trim:true,
        required: true,
        minlength:10,
        maxlength:200,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    image:{
        type: Object,
        default:{
            url:"",
            publicId:null,
        }
    },

    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]
},{
    timestamps:true,
    toJSON:{virtuals:true}, // for virtual
    toObject:{virtuals:true} // for virtual
})


// populate comments that belong to this post when u seach the post

PostSchema.virtual("comments",{

    ref:"Comment",
    foreignField:"postId",
    localField:"_id",
 
 })


const Post = mongoose.model('Post',PostSchema)



// Validate Create Post 

function validateCreatePost(obj)
{
    const schema = joi.object({
        title:joi.string().trim().min(2).max(10).required(),
        description:joi.string().trim().required(),
        category:joi.string().required(),
    })
    return schema.validate(obj)

}



// Validate Update Post 

function validateUpdatePost(obj)
{
    const schema = joi.object({
        title:joi.string().trim().min(2).max(10),
        description:joi.string().trim(),
        category:joi.string(),
    })

    return schema.validate(obj)
}




module.exports = {Post,validateUpdatePost,validateCreatePost}