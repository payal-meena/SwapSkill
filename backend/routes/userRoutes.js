const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware.js");
const validate = require("../middleware/validateMiddleware.js");
const { signupSchema } = require("../validations/authValidation.js");
const upload = require("../middleware/uploadMiddleware.js");


const {
  getMyProfile,
  updateProfile,
  updatePassword,
  updateProfileImage,
  deleteMyAccount 
} = require("../controllers/userController.js");

const {
  addSkill,
  deleteSkill,
} = require("../controllers/skillController.js");

const {
  loginUser,
  SignupUser,
} = require("../controllers/authController.js");

router.post("/login", loginUser);
router.post("/signup", validate(signupSchema), SignupUser);

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteMyAccount);



router.put("/password", protect, updatePassword);
router.put(
  "/profile-image",
  protect,
  upload.single("image"),
  updateProfileImage
);
router.post("/skill", protect, addSkill);
router.delete("/skill/:id", protect, deleteSkill);


module.exports = router;


