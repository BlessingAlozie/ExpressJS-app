const mongoose = require('mongoose')

const userScheme = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, requied: true, unique: true},
    password:{type: String, required: true}
})

module.exports = mongoose.model('User', userScheme)