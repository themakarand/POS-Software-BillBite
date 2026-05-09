const router = require("express").Router();
const auth = require("../middleware/Authmiddleware");
const {
  createOrder,
  addItem,
  completeOrder,
  moveTable,
  splitBill,
  getKOT,
  getOrders,
  updateStatus,
  removeItem
} = require("../controllers/OrderController");

router.get("/", auth, getOrders);
router.post("/move", auth, moveTable);
router.post("/split", auth, splitBill);
router.get("/kot/:orderId", auth, getKOT);

router.post("/create", auth, createOrder);
router.post("/add-item", auth, addItem);
router.post("/remove-item", auth, removeItem);
router.post("/complete", auth, completeOrder);
router.post("/update-status", auth, updateStatus);

module.exports = router;