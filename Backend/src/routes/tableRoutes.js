const router = require("express").Router();
const auth = require("../middleware/Authmiddleware");
const {
  createTable,
  getTables,
  updateTable,
  deleteTable
} = require("../controllers/tableController");

router.post("/", auth, createTable);
router.get("/", auth, getTables);
router.put("/:id", auth, updateTable);
router.delete("/:id", auth, deleteTable);

module.exports = router;