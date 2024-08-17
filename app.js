const express = require('express')
require("dotenv").config()
const connectToDb = require('./config/connectToDb.js')
const {notFound, errorHandler} = require('./middlewares/errors');
const logger = require('./middlewares/logger');


connectToDb()

const app = express()

// Apply Middleware
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: false}))




//  routes
app.use('/api/auth',require('./routers/authRoute.js'))
app.use('/api/users',require('./routers/usersRoute.js'))
app.use('/api/posts',require('./routers/postsRoute.js'))
app.use('/api/comments',require('./routers/commentRoute.js'))
app.use('/api/categories',require('./routers/categoriesRout.js'))

//Error handler Middleware
app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 8000
const server= app.listen(PORT,()=> console.log("Server listening on port " +PORT))

//  Handle recjetion outside Express
process.on('unhandleRejection',(err)=>{

    console.error(`UnhandleRejection Errors : ${err.name} | ${err.message}`)
 
    server.close(()=>{
      console.error(`Shutting down....`)
      process.exit(1)
    })
 })
 