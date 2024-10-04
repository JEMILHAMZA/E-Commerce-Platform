// controllers/productControllers.js
const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('admin/products', { products });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};


// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;

  try {
    const newProduct = new Product({ name, description, price, imageUrl, category });
    await newProduct.save();
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};


// Edit product form
exports.editProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/editProduct', { product });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    product.name = name;
    product.description = description;
    product.price = price;
    product.imageUrl = imageUrl;
    product.category = category;

    await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
