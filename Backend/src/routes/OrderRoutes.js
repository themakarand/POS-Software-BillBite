const router = require("express").Router();
const auth = require("../middleware/Authmiddleware");
const {
  createOrder,
  addItem,
  completeOrder,
  moveTable,
  splitBill,
  getKOT
} = require("../controllers/orderController");

router.post("/move", auth, moveTable);
router.post("/split", auth, splitBill);
router.get("/kot/:orderId", auth, getKOT);

router.post("/create", auth, createOrder);
router.post("/add-item", auth, addItem);
router.post("/complete", auth, completeOrder);

module.exports = router;