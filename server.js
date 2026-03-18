require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const Product = require('./models/Product')

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

// GET all products from database
app.get('/api/products', async (req, res) =>{
  try {
    const result = await Product.find()
    res.json(result)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// GET one product by ID
app.get('/api/products/:id', async (req, res) =>{
  try {
    const result = await Product.findById(req.params.id)
    if(!result) return res.status(404).json({message: "Produt Not Found"})
    res.json(result)
  } 
  catch (error) {
    res.status(500).json({message: error.message})
  }
})

// POST — create new product
app.post('/api/products', async (req, res) =>{
  try {
    result = Product.create(req.body)
  res.status(201).json(result)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})


// PUT — update a product
app.put('/api/products/:id', async (req, res) =>{
  try {
    const result = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!result) return res.status(404).json({message: 'Product not founf'})
    res.json(result)
  } 
  catch (error) {
  res.status(400).json({message: error.message})
  }
})

// DELETE — remove a product

app.delete('/api/products/:id', async(req, res) =>{
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({message: 'Product Deleted'})
  } 
  catch (error) {
  res.status(500).json({message: error.message})
  }
})




// app.delete('/api/products/:id', async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id)
//     res.json({ message: 'Product deleted' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

app.listen(3000, () => {
  console.log('server is running on http://localhost:3000')
})