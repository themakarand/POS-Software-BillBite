const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  gst: Number
});

// ✅ IMPORTANT LINE
module.exports = mongoose.model("Product", productSchema);