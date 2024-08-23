const mongoose = require('mongoose')
const connect = mongoose.connect('mongodb+srv://agamanstha41:pTeVU2kBtCnQzv0o@distortion.61lbmo2.mongodb.net/Web-App?retryWrites=true&w=majority&appName=distortion')

// Database connection

connect.then(()=>{
    console.log("Database has been connected successfully")
})
.catch(()=>{
    console.log("Database couldn't be connected.")
})

//Creating a schema 
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }},
    {collection: 'Sign-In-Data'}
) 

const msgSchema = mongoose.Schema({
    message: String
},
{collection: 'messages'});

const loginModel = mongoose.model('Web-App',loginSchema)
const msgModel = mongoose.model('message', msgSchema)

module.exports = {
    loginModel,
    msgModel
}
