const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  qty: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  status: { type: String, enum: ["pending", "running", "cooking", "completed"], default: "pending" },
  items: [orderItemSchema],
  subtotal: Number,
  gst: Number,
  discount: Number,
  total: Number
}, { timestamps: true });

// ✅ IMPORTANT
module.exports = mongoose.model("Order", orderSchema);