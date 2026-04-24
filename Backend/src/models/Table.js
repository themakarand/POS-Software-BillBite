const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    enum: ["available", "occupied", "reserved"],
    default: "available"
  }
});

module.exports = mongoose.model("Table", tableSchema);