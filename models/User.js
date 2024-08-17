const mongoose = require('mongoose')
const joi = require('joi')

const userSchema = new mongoose.Schema({

         username:{
            type:String,
            trim:true,
            required:true,
            minlegth:3,
            maxlength:50,
         },
         
         email:{
            type:String,
            trim:true,
            required:true,
            minlegth:3,
            maxlength:50,
            unique:true
         },

         password:{
            type:String,
            required:true,
            min:3,
         },
         
         profilPhoto:{
           type : Object,
           default:{
              url:"https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png",
              publicId:null,
           }
         },

         bio:String,

        isAdmin:{
            type:Boolean,
            default:false
        },

        isAccountVerified:{
            type:Boolean,
            default:false
        },

        
} , {
   timestamps:true,
   toJSON:{virtuals:true}, // for virtual
   toObject:{virtuals:true} // for virtual
})


// populate posts that belong to this user when he/she get her/his profile

userSchema.virtual("posts",{

   ref:"Post",
   foreignField:"user",
   localField:"_id",

})

// Validation user information Register

function validateRegisterUser(obj) {
    
    const Schema = joi.object({
           username: joi.string().trim().min(3).max(50).required(),
           email: joi.string().trim().min(3).max(50).required().email(),
           password: joi.string().trim().min(3).required(),
    })

    return Schema.validate(obj)
}


// Validation user information Login

function validateLoginUser(obj) {
    
   const Schema = joi.object({
          email: joi.string().trim().min(3).max(50).required().email(),
          password: joi.string().trim().min(3).required(),
   })

   return Schema.validate(obj)
}

// Validation user information update

function validateUpdateUser(obj) {
    
   const Schema = joi.object({
          username: joi.string().trim().min(3).max(50).required(),
          password: joi.string().trim().min(3),
          bio: joi.string(),
   })

   return Schema.validate(obj)
}












const User = mongoose.model('User',userSchema)


module.exports={User  , validateRegisterUser , validateLoginUser ,validateUpdateUser }










