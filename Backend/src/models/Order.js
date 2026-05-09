const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  qty: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  mode: { type: String, enum: ["Dine In", "Take Away", "Delivery"], default: "Dine In" },
  customer_name: String,
  phone: String,
  address: String,
  status: { type: String, enum: ["new", "pending", "running", "cooking", "ready", "completed", "delivered"], default: "pending" },
  items: [orderItemSchema],
  subtotal: Number,
  gst: Number,
  discount: Number,
  total: Number
}, { timestamps: true });

// ✅ IMPORTANT
module.exports = mongoose.model("Order", orderSchema);