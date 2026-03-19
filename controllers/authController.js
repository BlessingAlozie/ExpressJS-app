const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// register

const register = async (req, res) =>{
    // Step 1 — get what the user sent
    try {
    const {name, email, password} = req.body

// Step 2 & 3 — check if email exists
      const existingUser = await User.findOne({email})
      if(existingUser) return res.status(400).json({message: 'User already exist'})
        
    // // Step 4 — Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Step 5 — save to database
    const user = await User.create({
        name,
        email,
        password: hashedPassword

    })

    // Step 6 — create token
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
// Step 7 — send back token and user
    res.status(201).json({ 
    token,
    user:{name: user.name, email: user.email}
    })
    } 
    catch (error) {
    res.status(500).json({message: error.message})
    }
}

// Login

const login = async(req, res) =>{
    try {
     const {name, email, password} = req.body

     // Check if user exists

     const user = await User.findOne({email})
     if(!user) return res.status(401).json({message: 'Invalid credentials'})
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(401).json({message: 'Invalid credentials'})

     // Create a token
     const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
     })
     res.json({
        token,
        user:{name: user.name, email: user.email}
     })
    } 
    catch (error) {
    res.status(500).json({ message: error.message })
    }
}

module.exports = {register, login}