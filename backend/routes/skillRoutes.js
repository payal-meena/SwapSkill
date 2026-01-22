const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  addSkill,
  getMySkills,
  getUserSkills,
  deleteSkill,
} = require("../controllers/skillController");

router.post("/", protect, upload.single("thumbnail"), addSkill);
router.get("/my", protect, getMySkills);
router.get("/user/:userId", getUserSkills);
router.delete("/:id", protect, deleteSkill);

module.exports = router;
