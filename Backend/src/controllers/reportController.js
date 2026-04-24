const Order = require("../models/Order");

// 📅 1. Get Summary Report (with date filter)
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = { status: "completed" };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter);

    let totalRevenue = 0;
    let totalGST = 0;

    orders.forEach(order => {
      totalRevenue += order.total || 0;
      totalGST += order.gst || 0;
    });

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      totalGST
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ status: "completed" })
      .populate("table")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getTopItems = async (req, res) => {
  try {
    const orders = await Order.find({ status: "completed" });

    const itemMap = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = 0;
        }
        itemMap[item.name] += item.qty;
      });
    });

    const result = Object.keys(itemMap).map(name => ({
      name,
      qty: itemMap[name]
    }));

    result.sort((a, b) => b.qty - a.qty);

    res.json(result);

  } catch (err) {
    res.status(500).json(err.message);
  }
};