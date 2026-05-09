const router = require("express").Router();
const { register, login, socialLogin, forgotPassword, resetPassword } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/social-login", socialLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;