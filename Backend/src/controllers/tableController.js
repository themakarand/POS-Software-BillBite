const Table = require("../models/Table");

// Create table
exports.createTable = async (req, res) => {
  try {
    const { name, seats, section } = req.body;
    const table = await Table.create({ user: req.user.id, name, seats, section });
    res.json(table);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Get all tables
exports.getTables = async (req, res) => {
  const tables = await Table.find({ user: req.user.id });
  res.json(tables);
};

// Update table
exports.updateTable = async (req, res) => {
  const { id } = req.params;
  const { status, name, seats, section } = req.body;

  try {
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (name !== undefined) updateData.name = name;
    if (seats !== undefined) updateData.seats = seats;
    if (section !== undefined) updateData.section = section;

    const table = await Table.findByIdAndUpdate(
      id,
      updateData,
      { new: true } 
    );
    res.json(table);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Delete table
exports.deleteTable = async (req, res) => {
  const { id } = req.params;
  try {
    await Table.findByIdAndDelete(id);
    res.json({ message: "Table deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};