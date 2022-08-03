const router = require("express").Router();
const authCtrl = require("../controller/authCrl");

router.post("/register", authCtrl.register)
router.post("/login", authCtrl.login)
router.post("/refresh_token", authCtrl.refreshToken)
router.post("/logout",authCtrl.logout)
// RESET PASSWORD
router.post("/reset-password", authCtrl.resetPassword );

module.exports = router;
