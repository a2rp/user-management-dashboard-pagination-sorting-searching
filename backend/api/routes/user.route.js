const express = require("express");
const router = express.Router();

const {
    login,
    allUsers,
    addUser,
    updateUser,
    deleteOneUser,
    getOneUser,
} = require("../controllers/user.controller");

router.post("/login", login);
router.get("/user-all", allUsers);
router.post("/user", getOneUser);
router.post("/user-add", addUser);
router.patch("/user-update", updateUser);
router.delete("/user-delete/:email", deleteOneUser);


module.exports = router;

