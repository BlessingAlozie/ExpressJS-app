const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')

// Public routes — no token needed
router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', createProduct)

// Protected routes — token required
router.put('/:id', protect, updateProduct)
router.delete('/:id', protect, deleteProduct)

module.exports = router