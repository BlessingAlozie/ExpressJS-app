require('dotenv').config()
const mongoose = require('mongoose')
const product = require('./models/products')
// Import the Express framework
const express = require('express')
// Import the CORS package to allow requests from other origins
const cors = require('cors')

// Create the Express application
const app = express()
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('DB not connected', error.message))



// Allow Express to read JSON data from incoming requests
app.use(express.json())

// Logger middleware — logs every incoming request with its method and URL
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`)
  next()
})

// Only allow requests coming from your Vue app
app.use(cors({
  origin: 'http://localhost:5173'
}))

// Route for the homepage — just confirms the server is alive
app.get('/', (req, res) => {
  res.json({ message: 'Yup, server is ready' })
})



// Get all products from the real database
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




// Route that returns only 1 product when called
app.get('/api/products/:id', (req,res) =>{
    const oneProduct = products.find(f => f.id === Number(req.params.id))
    if(!oneProduct) return res.status(404).json({message: 'Product Not Found' })
    res.json(oneProduct)
})


// Route that accepts new products
app.post('/api/products', (req, res) =>{
    const newProduct = {
        id: products.length + 1,
        ...req.body
    }
    products.push(newProduct)
    res.status(201).json(newProduct)
})

// Route that updates the an 
app.put('/api/products/:id', (req, res) =>{
    const index = products.findIndex(p => p.id === Number(req.params.id))
    if(index === -1) return res.status(404).json({message:'Product Not found'})
    products[index] = {...products[index], ...req.body}
    res.json(products[index])
})

app.delete('/api/products/:id', (req, res) =>{
     products =  products.filter(i => i.id !== Number(req.params.id))
    res.json({message: 'Product deleted' })
})

// Start the server and listen for requests on port 3000
app.listen(3000, () => {
  console.log('server is running on http://localhost:3000')
})