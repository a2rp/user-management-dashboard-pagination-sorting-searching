const express = require("express");
const { rateLimit } = require("express-rate-limit");
const {
    login,
    getSession,
    logout,
    allUsers,
    addUser,
    updateUser,
    deleteOneUser,
    getOneUser,
} = require("../controllers/user.controller");
const { requireSession, requireRoles } = require("../middlewares/require-session");

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many sign-in attempts. Try again later" },
});

router.post("/login", loginLimiter, login);
router.get("/session", requireSession, getSession);
router.post("/logout", logout);

router.get("/user-all", requireSession, allUsers);
router.post("/user", requireSession, getOneUser);
router.post("/user-add", requireSession, requireRoles("administrator"), addUser);
router.patch("/user-update", requireSession, requireRoles("administrator", "editor"), updateUser);
router.delete("/user-delete/:email", requireSession, requireRoles("administrator"), deleteOneUser);

module.exports = router;
