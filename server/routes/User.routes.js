const express = require("express");
const router = express.Router();

const {
  getUserById,
  deleteUserAccount,
  getTopUsersByReputation,
  updateUserProfile,
  changePassword,
  updateDisplayPicture,
} = require("../controllers/User.controller");
const { auth } = require("../middlewares/Auth.middleware");

router.get("/getUserById/:userId", getUserById);
router.delete("/deleteUserAccount", auth, deleteUserAccount);
router.get("/getTopUsers", getTopUsersByReputation);
router.put("/updateUserProfile", auth, updateUserProfile);
router.put("/changePassword", auth, changePassword);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
module.exports = router;
