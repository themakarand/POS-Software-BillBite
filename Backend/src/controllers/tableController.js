const Table = require("../models/Table");

// Create table
exports.createTable = async (req, res) => {
  try {
    const { name } = req.body;
    const table = await Table.create({ name });
    res.json(table);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Get all tables
exports.getTables = async (req, res) => {
  const tables = await Table.find();
  res.json(tables);
};

// Update status
exports.updateTable = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const table = await Table.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  res.json(table);
};