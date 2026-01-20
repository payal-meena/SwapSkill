const express = require("express");
const router = express.Router();

const {
  addSkill,
  getMySkills,
  getUserSkills,
  deleteSkill,
} = require("../controllers/skillController");

// const auth = require("../middleware/authMiddleware");

router.post("/",  addSkill);
router.get("/my", getMySkills);
router.get("/user/:userId", getUserSkills);
router.delete("/:id",  deleteSkill);

module.exports = router;
