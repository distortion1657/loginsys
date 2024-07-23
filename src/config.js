const mongoose = require('mongoose')
const connect = mongoose.connect('mongodb+srv://agamanstha41:pTeVU2kBtCnQzv0o@distortion.61lbmo2.mongodb.net/logins?retryWrites=true&w=majority&appName=distortion')

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
    {collection: "Login"}
)

const collection = mongoose.model('Login', loginSchema)
module.exports = collection;
