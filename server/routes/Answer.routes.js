const express = require("express");
const router = express.Router();

const {
  createAnswer,
  deleteAnswer,
  editAnswer,
  approveAnswer,
  voteAnswer,
  getAllPendingAnswersForUser

} = require("../controllers/Answer.controller");

const { auth } = require("../middlewares/Auth.middleware");

router.post("/createAnswer", auth, createAnswer);
router.delete("/deleteAnswer/:answerId", auth, deleteAnswer);
router.put("/editAnswer/:answerId", auth, editAnswer);
router.put("/voteAnswer/:answerId", auth, voteAnswer);
router.post('/approveAnswer/:answerId', auth, approveAnswer);
router.post("/pendingAnswers", auth, getAllPendingAnswersForUser); // Assuming this is for pending answers
module.exports = router;
