const mongoose = require("mongoose");
const Order = require("../models/Order");
const Table = require("../models/Table");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  const { tableId } = req.body;

  const existing = await Order.findOne({
    table: tableId,
    status: { $ne: "completed" }
  });

  if (existing) return res.json(existing);

  const order = await Order.create({ table: tableId });

  await Table.findByIdAndUpdate(tableId, { status: "occupied" });

  res.json(order);
};

// ADD ITEM
exports.addItem = async (req, res) => {
  const { orderId, product } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json("Order not found");

  const existingItem = order.items.find(
    i => i.product.toString() === product._id
  );

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    order.items.push({
      product: product._id,
      name: product.name,
      qty: 1,
      price: product.price
    });
  }

  let subtotal = 0;
  order.items.forEach(i => {
    subtotal += i.qty * i.price;
  });

  order.subtotal = subtotal;
  order.gst = subtotal * 0.05;
  order.total = subtotal + order.gst;

  await order.save();

  res.json(order);
};

// COMPLETE ORDER
exports.completeOrder = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json("Order not found");

  order.status = "completed";
  await order.save();

  await Table.findByIdAndUpdate(order.table, {
    status: "available"
  });

  res.json("Order completed");
};

// UPDATE STATUS (KITCHEN)
exports.updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json("Order not found");

  order.status = status;
  await order.save();

  if (status === "completed" && order.table) {
    await Table.findByIdAndUpdate(order.table, {
      status: "available"
    });
  }

  res.json(order);
};

// MOVE TABLE
exports.moveTable = async (req, res) => {
  const { orderId, newTableId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json("Order not found");

  const oldTable = order.table;

  order.table = newTableId;
  await order.save();

  await Table.findByIdAndUpdate(oldTable, { status: "available" });
  await Table.findByIdAndUpdate(newTableId, { status: "occupied" });

  res.json("Table moved");
};

// SPLIT BILL
exports.splitBill = async (req, res) => {
  const { orderId, items } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json("Order not found");

  const newItems = [];
  order.items = order.items.filter(item => {
    if (items.includes(item._id.toString())) {
      newItems.push(item);
      return false;
    }
    return true;
  });

  const newOrder = await Order.create({
    table: order.table,
    items: newItems
  });

  await order.save();

  res.json({ original: order, split: newOrder });
};

// KOT
exports.getKOT = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json("Invalid Order ID");
    }

    const order = await Order.findById(orderId).populate("table");

    if (!order) {
      return res.status(404).json("Order not found");
    }

    if (!order.items || order.items.length === 0) {
      return res.status(400).json("No items in order");
    }

    const kot = {
      table: order.table?.name || "N/A",
      items: order.items.map(item => ({
        name: item.name,
        qty: item.qty
      }))
    };

    res.json(kot);

  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
};

// GET ALL ORDERS (with stats)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("table", "name")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(o => ({
      ...o._doc,
      table: o.table ? o.table.name : "Take Away",
      mode: o.table ? "Dine in" : "Take Away",
      customer_name: "Guest", // backend doesn't store this yet
    }));

    // Calculate stats
    const totalRevenue = orders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status !== "completed").length;
    const completedOrders = orders.filter(o => o.status === "completed").length;
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      orders: formattedOrders,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        completedOrders,
        averageOrder
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
};