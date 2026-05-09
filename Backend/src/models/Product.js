const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  price: Number,
  category: String,
  gst: Number,
  img: String,
  prepTime: Number,
  status: String,
  description: String
});

// ✅ IMPORTANT LINE
module.exports = mongoose.model("Product", productSchema);