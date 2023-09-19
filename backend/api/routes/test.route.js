const express = require("express");
const router = express.Router();

const { a2rp } = require("../controllers/test.controller");

router.get("/a2rp", a2rp);

module.exports = router;

