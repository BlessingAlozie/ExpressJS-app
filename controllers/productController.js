const Product = require('../models/Product')

// Get all products
const getProducts = async (req, res) => {
  try {
    const result = await Product.find()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get one product
const getProduct = async (req, res) => {
  try {
    const result = await Product.findById(req.params.id)
    if (!result) return res.status(404).json({ message: 'Product Not Found' })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a product
const createProduct = async (req, res) => {
  try {
    const result = await Product.create(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update a product
const updateProduct = async (req, res) => {
  try {
    const result = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!result) return res.status(404).json({ message: 'Product not found' })
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product Deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct }