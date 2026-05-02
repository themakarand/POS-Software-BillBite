const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
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