const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  status: {
    type: String,
    enum: ["available", "occupied", "reserved"],
    default: "available"
  },
  seats: {
    type: Number,
    default: 4
  },
  section: {
    type: String,
    default: "ac"
  }
});

module.exports = mongoose.model("Table", tableSchema);