require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
// const Product = require('./models/Product')

const app = express()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ DB Error:', err.message))

// Middleware
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`)
  next()
})

// Routes
app.use('/api/products', require('./routes/products'))
// Routes
app.use('/api/products', require('./routes/products'))
app.use('/api/auth', require('./routes/auth'))  // add this line



// start server
app.listen(3000, () => {
  console.log('server is running on http://localhost:3000')
})