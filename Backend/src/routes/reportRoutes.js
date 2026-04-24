const router = require("express").Router();
const auth = require("../middleware/Authmiddleware");

const {
  getReports,
  getOrderHistory,
  getTopItems
} = require("../controllers/reportController");

router.get("/", auth, getReports);
router.get("/history", auth, getOrderHistory);
router.get("/top-items", auth, getTopItems);

module.exports = router;