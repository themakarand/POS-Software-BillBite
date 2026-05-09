const Product = require("../models/Product");

// Create product
exports.createProduct = async (req, res) => {
  const product = await Product.create({ ...req.body, user: req.user.id });
  res.json(product);
};

// Get all
exports.getProducts = async (req, res) => {
  const products = await Product.find({ user: req.user.id });
  res.json(products);
};

// Update
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.json(product);
};

// Delete
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.json("Deleted");
};