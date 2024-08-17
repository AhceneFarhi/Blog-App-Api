// const mongoose = require('mongoose')
// require("dotenv").config()


//  module.exports = async()=>{

//     try {
//         await mongoose.connect(process.env.MONGO_URI)
//         console.log("Connected to mongoDB ^_^ ");

//     } catch (error) {
        
//         console.log("Connection error ");
//     }
// }


const mongoose = require('mongoose')
require("dotenv").config()


 module.exports = ()=>{

    
         mongoose.connect(process.env.MONGO_URI).then((conn)=>{
            console.log(`Connected to mongoDB ^_^ , Data_Base : ${conn.connection.host}` );

         })

   
    // catch (error) {
        
    //     console.log("Connection error ");
    // }
}



