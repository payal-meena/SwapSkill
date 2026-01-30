const express = require("express");
const router = express.Router();
const { getAllMentors } = require("../controllers/exploreController");

router.get("/", getAllMentors);

module.exports = router;
