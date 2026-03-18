const express = require('express')
const router = express.Router()
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')

// GET all products
router.get('/', getProducts)

// GET one product
router.get('/:id', getProduct)

// POST — create new product
router.post('/', createProduct)

// PUT — update a product
router.put('/:id', updateProduct)

// DELETE — remove a product
router.delete('/:id', deleteProduct)

module.exports = router